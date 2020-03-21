const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getPlanets = (req, res) => {
    client.query('SELECT * FROM planet ORDER BY planetId', (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getPlanetById = (req, res) => {
    const planetId = parseInt(req.params.planetId);

    client.query('SELECT * FROM planet WHERE planetId = $1', [planetId], (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createPlanet = (req, res) => {
    const size = parseInt(req.params.size);
    const weight = parseInt(req.params.weight);
    const rotationSpeed = parseInt(req.params.rotationSpeed);
    const {name, composition, hasSatelite} = req.body;

    client.query('INSERT INTO planet (name, composition, hasSatelite, size, weight, rotationSpeed) VALUES ($1, $2, $3, $4, $5, $6)', [name, composition, hasSatelite, size, weight, rotationSpeed], 
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(201).send(`Planet added with Id: ${result.insertID}`);
    });
};

const updatePlanet = (req, res) => {
    const planetId = parseInt(req.params.planetId);
    const size = parseInt(req.params.size);
    const weight = parseInt(req.params.weight);
    const rotationSpeed = parseInt(req.params.rotationSpeed);
    const {name, composition, hasSatelite} = req.body;

    client.query('UPADATE planet SET name = $1, composition = $2, hasSatelite = $3, size = $4, weight = $5, rotationSpeed = $6 WHERE planetId = $7', [name, composition, hasSatelite, size, weight, rotationSpeed, planetId],
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).send(`Planet with id ${planetId} modified`);
    });
};

const deletePlanet = (req, res) => {
    const planetId = parseInt(req.params.planetId);

    client.query('DELETE FROM planet WHERE planetId = $1' [planetId],
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).send(`Planet with id ${planetId} is no mo!`);
    });
};

router.get('/planet/', (req, res) => getPlanets(req, res));
router.get('/planet/:id', (req, res) => getPlanetById(req, res));
router.post('/planet/', (req, res) => createPlanet(req, res));
router.put('/planet/:id', (req, res) => updatePlanet(req, res));
router.delete('/planet/:id', (req, res) => deletePlanet(req, res));

module.exports = router;