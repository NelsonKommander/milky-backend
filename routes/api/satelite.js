const router = require('express').Router({mergeParams: true});

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'kommander',
    password: 'Kommander030500',
    host: 'localhost',
    database: 'api',
    port: 5432
});

const getSatellites = (req, res) => {
    pool.query('SELECT * FROM satellite ORDER BY satelliteId', (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getSatelliteById = (req, res) => {
    const satelliteId = parseInt(req.params.satelite);

    pool.query('SELECT * FROM satellite WHERE satelliteId = $1', [satelliteIdite], (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createSatellite = (req, res) => {
    const size = parseInt(req.params.size);
    const weight = parseInt(req.params.weight);
    const {name, composition} = req.body;

    pool.query('INSERT INTO satellite (name, composition, size, weight) VALUES ($1, $2, $3, $4)', [name, composition, size, weight], 
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(201).send(`Satellite added with Id: ${result.insertID}`);
    });
};

const updateSatellite = (req, res) => {
    const satelliteId = parseInt(req.params.satelliteId);
    const size = parseInt(req.params.size);
    const weight = parseInt(req.params.weight);
    const {name, composition, hasSatelite} = req.body;

    pool.query('UPADATE satellite SET name = $1, composition = $2, size = $3, weight = $4, WHERE satelliteId = $5', [name, composition, size, weight, satelliteId],
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).send(`Satellite with id ${satelliteId} modified`);
    });
};

const deleteSatellite = (req, res) => {
    const satelliteId = parseInt(req.params.satelliteId);

    pool.query('DELETE FROM satellite WHERE satelliteId = $1' [satelliteId],
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).send(`Satellite with id ${satelliteId} is no mo!`);
    });
};

router.get('/satellite/', (req, res) => getSatellites(req, res));
router.get('/satellite/:id', (req, res) => getSatelliteById(req, res));
router.post('/satellite/', (req, res) => createSatellite(req, res));
router.put('/satellite/:id', (req, res) => updateSatellite(req, res));
router.delete('/satellite/:id', (req, res) => deleteSatellite(req, res));

module.exports = router;