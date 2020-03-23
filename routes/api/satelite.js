const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getSatellites = (req, res) => {
    client.query('SELECT * FROM satellite ORDER BY satellite_id',
    (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getSatelliteById = (req, res) => {
    const satelliteId = parseInt(req.params.id);
    var satellite = {"satelliteId": satelliteId, "name": "", "composition": "", "size": 0, "weight": 0, "planets": [], "stars": []};
    client.query('SELECT * FROM satellite WHERE satellite_id = $1',
    [satelliteId],
    (error, results) => {
        if (error){
            throw error;
        }
        satellite.name = results.rows[0].name;
        satellite.composition = results.rows[0].composition;
        satellite.size = results.rows[0].size;
        satellite.weight = results.rows[0].weight;
    });
    // Query do planeta
    client.query('SELECT p.name, p.planet_id, p.composition, p.size, p.weight, p.rotation_speed, p.has_satellite FROM planet AS p JOIN (satellite_planet AS sp JOIN satellite AS s USING (satellite_id)) USING (planet_id) WHERE satellite_id = $1',
    [satelliteId],
    (error, results) => {
        if (error){
            throw error;
        }
        satellite.planets = results.rows;
    });
    // Query da estrela
    client.query('SELECT s.name, s.star_id, s.size, s.age, s.earth_distance, s.has_satellite, s.is_blackhole, s.is_dead FROM star AS s JOIN (satellite_star AS ss JOIN satellite AS sat USING(satellite_id)) USING (star_id) WHERE satellite_id = $1',
    [satelliteId],
    (error, results) => {
        if (error){
            throw error;
        }
        satellite.stars = results.rows;
        res.status(200).send(satellite);
    });
};

const createSatellite = (req, res) => {
    let size = parseInt(req.body.size);
    let weight = parseInt(req.body.weight);
    const {name, composition} = req.body;

    if (isNaN(size)){
        size = null;
    }
    if (isNaN(weight)){
        weight = null;
    }
    if (name != null){
        client.query('INSERT INTO satellite (name, composition, size, weight) VALUES ($1, $2, $3, $4)',
        [name, composition, size, weight], 
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send(`Satellite added with Id: ${results.oid}`);
        });
    } else {
        res.send(401).send("Name cannot be null!");
    }
};

const updateSatellite = (req, res) => {
    const satelliteId = parseInt(req.params.id);
    let size = parseInt(req.body.size);
    let weight = parseInt(req.body.weight);
    const {name, composition} = req.body;

    if (isNaN(size)){
        size = null;
    }
    if (isNaN(weight)){
        weight = null;
    }
    if (name != null){
        client.query('UPADATE satellite SET name = $1, composition = $2, size = $3, weight = $4, WHERE satellite_id = $5',
        [name, composition, size, weight, satelliteId],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(200).send(`Satellite with id ${satelliteId} modified`);
        });
    } else {
        res.status(401).send("Name cannot be null!");
    }
};

const deleteSatellite = (req, res) => {
    const satelliteId = parseInt(req.params.id);

    client.query('DELETE FROM satellite WHERE satellite_id = $1',
    [satelliteId],
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