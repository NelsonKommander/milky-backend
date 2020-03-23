const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getSystems = (req, res) => {
    client.query('SELECT * FROM planetarySystem ORDER BY system_id', (error, results) => {
        if (error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getSystemById = (req, res) => {
    const id = parseInt(req.params.id);
    var system = {"systemId": id, "name": "", "age": 0, "numOfPlanets": 0, "numOfStars": 0, "myGalaxyName": "", "myGalaxyId": 0,"planets": [], "stars": []};
    client.query('SELECT ps.name, ps.age, ps.num_of_planets, ps.num_of_stars, galaxy_id, g.name AS galaxy_name FROM planetarySystem AS ps JOIN galaxy AS g USING (galaxy_id) WHERE system_id = $1',
    [id],
    (error, results) => {
        if (error){
            throw error;
        }
        system.name = results.rows[0].name;
        system.age = results.rows[0].age;
        system.numOfPlanets = results.rows[0].num_of_planets;
        system.numOfStars = results.rows[0].num_of_stars;
        system.myGalaxyId = results.rows[0].galaxy_id;
        system.myGalaxyName = results.rows[0].galaxy_name;
    });
    // Query dos planetas
    client.query('SELECT p.planet_id, p.size, p.weight, p.rotation_speed, p.has_satellite, p.name, p.composition FROM planet AS p JOIN (planet_in_system AS pin JOIN planetarysystem AS ps USING (system_id)) USING (planet_id) WHERE system_id = $1',
    [id],
    (error, results) => {
        if (error){
            throw error;
        }
        system.planets = results.rows;
    });
    // Query das estrelas
    client.query('SELECT s.star_id, s.name, s.startype, s.size, s.age, s.earth_distance, s.has_satellite, s.is_blackhole, s.is_dead FROM star AS s JOIN (star_in_system AS sin JOIN planetarysystem AS ps USING(system_id)) USING(star_id) WHERE system_id = $1',
    [id],
    (error, results) => {
        if (error){
            throw error;
        }
        system.stars = results.rows;
        res.status(200).send(system);
    });
};

const createSystem = (req, res) => {
    let numOfPlanets = parseInt(req.body.numOfPlanets);
    let numOfStars = parseInt(req.body.numOfStars);
    let age = parseInt(req.body.age);
    const galaxyId = parseInt(req.body.galaxyId);
    const {name} = req.body;

    if (isNaN(numOfPlanets)){
        numOfPlanets = null;
    }
    if (isNaN(numOfStars)){
        numOfStars = null;
    }
    if (isNaN(age)){
        age = null;
    }
    if (name != null && !isNaN(galaxyId)){
        client.query('INSERT INTO planetarySystem (num_of_planets, num_of_stars, age, name, galaxy_id) VALUES ($1, $2, $3, $4, $5)',
        [numOfPlanets, numOfStars, age, name, galaxyId], 
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send("Planetary System added sucessfully!");
        });
    } else {
        res.status(401).send("Name or galaxyId cannot be null!");
    }
};

const updateSystem = (req, res) => {
    const systemId = parseInt(req.params.id);
    let numOfPlanets = parseInt(req.body.numOfPlanets);
    let numOfStars = parseInt(req.body.numOfStars);
    let age = parseInt(req.body.age);
    const galaxyId = parseInt(req.body.galaxyId);
    const {name} = req.body;

    if (isNaN(numOfPlanets)){
        numOfPlanets = null;
    }
    if (isNaN(numOfStars)){
        numOfStars = null;
    }
    if (isNaN(age)){
        age = null;
    }
    if (name != null && !isNaN(galaxyId)){
        client.query('UPDATE planetarySystem SET name = $1, age = $2, num_of_planets = $3, num_of_stars = $4 WHERE system_id = $5',
        [name, age, numOfPlanets, numOfStars, systemId],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(200).send(`System with id ${systemId} modified`);
        });
    } else {
        res.status(401).send("Name cannot be null!");
    }
};

const deleteSystem = (req, res) => {
    const systemId = parseInt(req.params.id);

    client.query('DELETE FROM planetarySystem WHERE system_id = $1',
    [systemId],
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