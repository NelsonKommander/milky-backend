const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getPlanets = (req, res) => {
    client.query('SELECT * FROM planet ORDER BY planet_id', (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getPlanetById = (req, res) => {
    const planetId = parseInt(req.params.id);
    var planet = {"planetId": planetId, "name": "", "composition": "", "size": 0, "weight": 0, "rotationSpeed": 0, "hasSatellite": false, "systems": [], "stars": [], "satellites": []};
    client.query('SELECT * FROM planet WHERE planet_id = $1', [planetId], (error, results) => {
        if (error){
            throw error;
        }
        planet.name = results.rows[0].name;
        planet.composition = results.rows[0].composition;
        planet.size = results.rows[0].size;
        planet.weight = results.rows[0].weight;
        planet.rotationSpeed = results.rows[0].rotation_speed;
        planet.hasSatellite = results.rows[0].has_satellite;
    });
    // Query dos sistemas
    client.query('SELECT ps.name, ps.system_id, ps.age, ps.num_of_stars, ps.num_of_planets FROM planet AS p JOIN (planet_in_system AS pin JOIN planetarysystem AS ps USING (system_id)) USING (planet_id) WHERE planet_id = $1',
    [planetId],
    (error, results) => {
        if (error){
            throw error;
        }
        planet.systems = results.rows;
    });
    // Query das estrelas
    client.query('SELECT s.name, s.star_id, s.startype, s.size, s.age, s.earth_distance, s.has_satellite, s.is_blackhole, s.is_dead FROM star AS s JOIN (planet_star AS ps JOIN planet AS p USING(planet_id)) USING(star_id) WHERE planet_id = $1',
    [planetId],
    (error, results) => {
        if (error){
            throw error;
        }
        planet.stars = results.rows;
    });
    // Query dos satellites
    client.query('SELECT s.name, s.satellite_id, s.composition, s.size, s.weight FROM planet AS p JOIN (satellite_planet AS sp JOIN satellite AS s USING (satellite_id)) USING (planet_id) WHERE planet_id = $1',
    [planetId],
    (error, results) => {
        if (error){
            throw error;
        }
        planet.satellites = results.rows;
        res.status(200).send(planet);
    })
};

const createPlanet = (req, res) => {
    let size = parseFloat(req.body.size);
    let weight = parseFloat(req.body.weight);
    let rotationSpeed = parseFloat(req.body.rotationSpeed);
    const {name, composition, hasSatellite} = req.body;

    if (isNaN(size)){
        size = null;
    }
    if (isNaN(weight)){
        weight = null;
    }
    if (isNaN(rotationSpeed)){
        rotationSpeed = null;
    }
    if (name != null){
        client.query('INSERT INTO planet (name, composition, has_satellite, size, weight, rotation_speed) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, composition, hasSatellite, size, weight, rotationSpeed], 
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send("Planet added sucessfully!");
        });
    } else {
        res.status(401).send("Name cannot be null!");
    }
};

const updatePlanet = (req, res) => {
    console.log("Seu JSON aí Allan: ");
    console.log(req.body);
    const planetId = parseInt(req.params.id);
    let size = parseFloat(req.body.size);
    let weight = parseFloat(req.body.weight);
    let rotationSpeed = parseFloat(req.body.rotationSpeed);
    const {name, composition, hasSatellite} = req.body;

    if (isNaN(size)){
        size = null;
    }
    if (isNaN(weight)){
        weight = null;
    }
    if (isNaN(rotationSpeed)){
        rotationSpeed = null;
    }
    if (name != null){
        client.query('UPDATE planet SET name = $1, composition = $2, has_satellite = $3, size = $4, weight = $5, rotation_speed = $6 WHERE planet_id = $7',
        [name, composition, hasSatellite, size, weight, rotationSpeed, planetId],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(200).send(`Planet with id ${planetId} modified`);
        });
    } else {
        res.send(401).send("Name cannot be null!");
    }
};

const deletePlanet = (req, res) => {
    const planetId = parseInt(req.params.id);

    client.query('DELETE FROM planet WHERE planet_id = $1',
    [planetId],
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