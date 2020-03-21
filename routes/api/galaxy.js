const router = require('express').Router({mergeParams: true});

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'kommander',
    password: 'Kommander030500',
    host: 'localhost',
    database: 'multiverse',
    port: 5432
});
// Lembrar de checar a criação e o update!!! A descrição da entidade no banco está errada!!!
const getGalaxy = (req, res) => {
    pool.query('SELECT * FROM galaxy ORDER BY galaxyId', (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getGalaxyById = (req, res) => {
    const galaxyId = parseInt(req.params.galaxyId);

    pool.query('SELECT * FROM galaxy WHERE galaxyId = $1', [galaxyId], (error, results) => {
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

    pool.query('INSERT INTO galaxy (numOfSystems, earthDistance, name) VALUES ($1, $2, $3, )', [numOfSystems, earthDistance, name], 
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

    pool.query('UPADATE galaxy SET name = $1, numOfSystems = $2, earthDistance = $3, WHERE galaxyId = $4', [name, numOfSystems, earthDistance, galaxyId],
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).send(`Galaxy with id ${galaxyId} modified`);
    });
};

const deleteGalaxy = (req, res) => {
    const galaxyId = parseInt(req.params.galaxyId);

    pool.query('DELETE FROM galaxy WHERE galaxyId = $1' [galaxyId],
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