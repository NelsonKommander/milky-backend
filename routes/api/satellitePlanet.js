const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getSatellitePlanet = (req, res) => {
    client.query('SELECT * FROM satellite_planet ORDER BY planet_id ASC', (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createSatellitePlanet = (req, res) => {
    const satelliteId = parseInt(req.body.satelliteId);
    const planetId = parseInt(req.body.planetId);
    if (!isNaN(satelliteId) && !isNaN(planetId)){
        client.query('INSERT INTO satellite_planet (satellite_id, planet_id) VALUES ($1, $2)',
        [satelliteId, planetId],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send("Relationship added with sucess!");
        });
    } else {
        res.status(401).send("Provide both ids (satellite and planet)!");
    }
};

const deleteSatellitePlanet = (req, res) => {
    const satelliteId = parseInt(req.body.satelliteId);
    const planetId = parseInt(req.body.planetId);

    client.query('DELETE FROM satellite_planet WHERE satellite_id = $1 && planet_id = $2', [satelliteId, planetId], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send("Relationship deleted!");
    });
}

router.get('/satellitePlanet/', (req, res) => getSatellitePlanet(req, res));
router.post('/satellitePlanet/', (req, res) => createSatellitePlanet(req, res));
router.delete('/satellitePlanet/', (req, res) => deleteSatellitePlanet(req, res));

module.exports = router;