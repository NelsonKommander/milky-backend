const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getPlanetInSystem = (req, res) => {
    client.query('SELECT * FROM planet_in_system ORDER BY system_id ASC', (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createPlanetInSystem = (req, res) => {
    const planetId = parseInt(req.body.planetId);
    const systemId = parseInt(req.body.systemId);
    if (!isNaN(planetId) && !isNaN(systemId)){
        client.query('INSERT INTO planet_in_system (planet_id, system_id) VALUES ($1, $2)',
        [planetId, systemId],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send("Relationship added with sucess!");
        });
    } else {
        res.status(401).send("Provide both ids (planet and system)!");
    }
};

const deletePlanetInSystem = (req, res) => {
    const planetId = parseInt(req.body.planetId);
    const systemId = parseInt(req.body.systemId);

    client.query('DELETE FROM planet_in_system WHERE planet_id = $1 && system_id = $2', [planetId, systemId], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send("Relationship deleted with sucess!");
    });
}

router.get('/planetInSystem/', (req, res) => getPlanetInSystem(req, res));
router.post('/planetInSystem/', (req, res) => createPlanetInSystem(req, res));
router.delete('/planetInSystem/', (req, res) => deletePlanetInSystem(req, res));

module.exports = router;