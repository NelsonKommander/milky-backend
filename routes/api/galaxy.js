const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();
// Lembrar de checar a criação e o update!!! A descrição da entidade no banco está errada!!!
const getGalaxy = (req, res) => {
    client.query('SELECT * FROM galaxy ORDER BY galaxyId', (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getGalaxyById = (req, res) => {
    const galaxyId = parseInt(req.params.galaxyId);

    client.query('SELECT * FROM galaxy WHERE galaxyId = $1', [galaxyId], (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createGalaxy = (req, res) => {
    const numOfSystems = parseInt(req.params.numOfSystems);
    const earthDistance = parseInt(req.params.earthDistance);
    const {name} = req.body;

    client.query('INSERT INTO galaxy (numOfSystems, earthDistance, name) VALUES ($1, $2, $3, )', [numOfSystems, earthDistance, name], 
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(201).send(`Galaxy added with Id: ${result.insertID}`);
    });
};

const updateGalaxy = (req, res) => {
    const galaxyId = parseInt(req.params.galaxyId);
    const numOfSystems = parseInt(req.params.numOfSystems);
    const earthDistance = parseInt(req.params.earthDistance);
    const {name} = req.body;

    client.query('UPADATE galaxy SET name = $1, numOfSystems = $2, earthDistance = $3, WHERE galaxyId = $4', [name, numOfSystems, earthDistance, galaxyId],
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).send(`Galaxy with id ${galaxyId} modified`);
    });
};

const deleteGalaxy = (req, res) => {
    const galaxyId = parseInt(req.params.galaxyId);

    client.query('DELETE FROM galaxy WHERE galaxyId = $1' [galaxyId],
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).send(`Galaxy with id ${galaxyId} is no mo!`);
    });
};

router.get('/galaxy/', (req, res) => getGalaxy(req, res));
router.get('/galaxy/:id', (req, res) => getGalaxyById(req, res));
router.post('/galaxy/', (req, res) => createGalaxy(req, res));
router.put('/galaxy/:id', (req, res) => updateGalaxy(req, res));
router.delete('/galaxy/:id', (req, res) => deleteGalaxy(req, res));

module.exports = router;