const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getGalaxy = (req, res) => {
    client.query('SELECT * FROM galaxy ORDER BY galaxy_id',
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getGalaxyById = (req, res) => {
    const galaxyId = parseInt(req.params.id);
    var galaxy = {"galaxyId": galaxyId,"name": "", "numOfSystems": 0, "earthDistance": 0, "systems" : {}};
    client.query('SELECT * FROM galaxy WHERE galaxy_id = $1', [galaxyId], (error, results) => {
        if (error){
            throw error;
        }
        galaxy["name"] = results.rows[0].name;
        galaxy["numOfSystems"] = results.rows[0].num_of_systems;
        galaxy["earthDistance"] = results.rows[0].earth_distance;
    });
    client.query('SELECT p.system_id, p.galaxy_id, p.num_of_planets, p.num_of_stars, p.age, p.name FROM galaxy AS g JOIN planetarysystem AS p ON (g.galaxy_id = p.galaxy_id) WHERE g.galaxy_id = $1',
    [galaxyId],
    (error, results) => {
        if (error){
            throw error;
        }
        galaxy["systems"] = results.rows;
        res.status(200).send(galaxy);
    });
};

const createGalaxy = (req, res) => {
    const numOfSystems = parseInt(req.body.numOfSystems);
    const earthDistance = parseInt(req.body.earthDistance);
    const {name} = req.body;
    if (name != null){
        client.query('INSERT INTO galaxy (num_of_systems, earth_distance, name) VALUES ($1, $2, $3)',
        [numOfSystems, earthDistance, name], 
        (error, results) => {
        if (error){
            throw error;
        }
        res.status(201).send(`Galaxy added with Id: ${results.oid}`);
    });
    } else {
        res.status(401).send("Name cannot be null!");
    }
};

const updateGalaxy = (req, res) => {
    const galaxyId = parseInt(req.params.id);
    const numOfSystems = parseInt(req.body.numOfSystems);
    const earthDistance = parseInt(req.body.earthDistance);
    const {name} = req.body;
    if (name != null){
        client.query('UPDATE galaxy SET name = $1, num_of_systems = $2, earth_distance = $3 WHERE galaxy_id = $4',
        [name, numOfSystems, earthDistance, galaxyId],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(200).send(`Galaxy with id ${galaxyId} modified`);
        });
    } else {
        res.status(401).send("Name cannot be null!");
    }
};

const deleteGalaxy = (req, res) => {
    const galaxyId = parseInt(req.params.id);

    client.query('DELETE FROM galaxy WHERE galaxy_id = $1', [galaxyId], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send(`Galaxy deleted with ID: ${galaxyId}`);
    });
};

router.get('/galaxy/', (req, res) => getGalaxy(req, res));
router.get('/galaxy/:id', (req, res) => getGalaxyById(req, res));
router.post('/galaxy/', (req, res) => createGalaxy(req, res));
router.put('/galaxy/:id', (req, res) => updateGalaxy(req, res));
router.delete('/galaxy/:id', (req, res) => deleteGalaxy(req, res));

module.exports = router;