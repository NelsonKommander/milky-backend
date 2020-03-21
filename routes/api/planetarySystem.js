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
const getSystems = (req, res) => {
    pool.query('SELECT * FROM planetarySystem ORDER BY systemId', (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getSystemById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM planetarySystem WHERE systemId = $1', [id], (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createSystem = (req, res) => {
    const numOfPlanets = parseInt(req.params.numOfPlanets);
    const numOfStars = parseInt(req.params.numOfStars);
    const age = parseInt(req.params.age);
    const {name} = req.body;

    pool.query('INSERT INTO planetarySystem (numOfPlanets, numOfStars, age, name) VALUES ($1, $2, $3, $4)', [numOfPlanets, numOfStars, age, name], 
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(201).send(`Planetary System added with Id: ${result.insertID}`);
    });
};

const updateSystem = (req, res) => {
    const systemId = parseInt(req.params.systemId);
    const numOfPlanets = parseInt(req.params.numOfPlanets);
    const numOfStars = parseInt(req.params.numOfStars);
    const age = parseInt(req.params.age);
    const {name} = req.body;

    pool.query('UPADATE planetarySystems SET name = $1, age = $2, numOfPlanets = $3, numOfStars = 4, WHERE systemId = $5', [name, age, numOfPlanets, numOfStars, systemId],
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).send(`System with id ${systemId} modified`);
    });
};

const deleteSystem = (req, res) => {
    const systemId = parseInt(req.params.systemId);

    pool.query('DELETE FROM planetarySystems WHERE systemId = $1' [systemId],
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).send(`System with id ${systemId} is no mo!`);
    });
};

router.get('/planetarySystems/', (req, res) => getSystems(req, res));
router.get('/planetarySystems/:id', (req, res) => getSystemById(req, res));
router.post('/planetarySystems/', (req, res) => createSystem(req, res));
router.put('/planetarySystems/:id', (req, res) => updateSystem(req, res));
router.delete('/planetarySystems/:id', (req, res) => deleteSystem(req, res));

module.exports = router;