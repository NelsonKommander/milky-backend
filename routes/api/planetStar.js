const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getPlanetStar = (req, res) => {
    client.query('SELECT * FROM planet_star ORDER BY planet_id ASC', (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createPlanetStar = (req, res) => {
    const starId = parseInt(req.body.starId);
    const planetId = parseInt(req.body.planetId);
    if (!isNaN(starId) && !isNaN(planetId)){
        client.query('INSERT INTO planet_star (star_id, planet_id) VALUES ($1, $2)',
        [starId, planetId],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send("Relationship added with sucess!");
        });
    } else {
        res.status(401).send("Provide both ids (star and planet)!");
    }
};

const deletePlanetStar = (req, res) => {
    const starId = parseInt(req.body.starId);
    const planetId = parseInt(req.body.planetId);

    client.query('DELETE FROM planet_star WHERE star_id = $1 && planet_id = $2', [starId, planetId], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send("Relationship deleted!");
    });
}

router.get('/planetStar/', (req, res) => getPlanetStar(req, res));
router.post('/planetStar/', (req, res) => createPlanetStar(req, res));
router.delete('/planetStar/', (req, res) => deletePlanetStar(req, res));

module.exports = router;