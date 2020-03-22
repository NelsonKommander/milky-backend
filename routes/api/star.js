const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getStar = (req, res) => {
    client.query('SELECT * FROM star ORDER BY star_id',
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
// To do
const getStarById = (req, res) => {
    const starId = parseInt(req.params.id);
    var star = {"starId": starId,"name": "", "numOfSystems": 0, "earthDistance": 0, "systems" : {}};
    client.query('SELECT * FROM star WHERE star_id = $1', [starId], (error, results) => {
        if (error){
            throw error;
        }
        star["name"] = results.rows[0].name;
        star["numOfSystems"] = results.rows[0].num_of_systems;
        star["earthDistance"] = results.rows[0].earth_distance;
    });
    client.query('SELECT p.system_id, p.star_id, p.num_of_planets, p.num_of_stars, p.age, p.name FROM star AS g JOIN planetarysystem AS p ON (g.star_id = p.star_id) WHERE g.star_id = $1',
    [starId],
    (error, results) => {
        if (error){
            throw error;
        }
        star["systems"] = results.rows;
        res.status(200).send(star);
    });
};

const createStar = (req, res) => {
    const size = parseInt(req.body.numOfSystems);
    const earthDistance = parseInt(req.body.earthDistance);
    const age = parseInt(req.body.age);
    const {name, starType, hasSatellite, isDead, isBlackhole} = req.body;
    if (starType == 'Anã branca' || starType == 'Anã vermelha' || starType == 'Estrela binária' || starType == 'Gigante azul' || starType == 'Gigante vermelha'){
        if (name != null && hasSatellite != null && isDead != null && isBlackhole != null){
            client.query('INSERT INTO star (name, earth_distance, size, age, startype, has_satellite, is_dead, is_blackhole) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [name, earthDistance, size, age, starType, hasSatellite, isDead, isBlackhole], 
            (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send(`Star added with Id: ${results.oid}`);
        });
        } else {
            res.status(401).send("Something that shouldn't be null is!");
        }
    } else {
        res.status(401).send("Invalid star type!");
    }
};

const updateStar = (req, res) => {
    const starId = parseInt(req.params.id);
    const size = parseInt(req.body.numOfSystems);
    const earthDistance = parseInt(req.body.earthDistance);
    const age = parseInt(req.body.age);
    const {name, starType, hasSatellite, isDead, isBlackhole} = req.body;
    if (starType == 'Anã branca' || starType == 'Anã vermelha' || starType == 'Estrela binária' || starType == 'Gigante azul' || starType == 'Gigante vermelha'){
        if (name != null && hasSatellite != null && isDead != null && isBlackhole != null){
            client.query('UPDATE star SET name = $1, earth_distance = $2, size = $3, age = $4, startype = $5, has_satellite = $6, is_dead = $7, is_blackhole = $8 WHERE star_id = $9',
            [name, earthDistance, size, age, starType, hasSatellite, isDead, isBlackhole, starId], 
            (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send(`Star with id ${starId} modified`);
        });
        } else {
            res.status(401).send("Something that shouldn't be null is!");
        }
    } else {
        res.status(401).send("Invalid star type!");
    }
};

const deleteStar = (req, res) => {
    const starId = parseInt(req.params.id);

    client.query('DELETE FROM star WHERE star_id = $1', [starId], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send(`Star deleted with ID: ${starId}`);
    });
};

router.get('/star/', (req, res) => getStar(req, res));
router.get('/star/:id', (req, res) => getStarById(req, res));
router.post('/star/', (req, res) => createStar(req, res));
router.put('/star/:id', (req, res) => updateStar(req, res));
router.delete('/star/:id', (req, res) => deleteStar(req, res));

module.exports = router;