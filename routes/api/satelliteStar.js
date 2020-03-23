const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getSatelliteStar = (req, res) => {
    client.query('SELECT * FROM satellite_star ORDER BY star_id ASC', (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createSatelliteStar = (req, res) => {
    const satelliteId = parseInt(req.body.satelliteId);
    const starId = parseInt(req.body.starId);
    if (!isNaN(satelliteId) && !isNaN(starId)){
        client.query('INSERT INTO satellite_star (satellite_id, star_id) VALUES ($1, $2)',
        [satelliteId, starId],
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

const deleteSatelliteStar = (req, res) => {
    const satelliteId = parseInt(req.body.satelliteId);
    const starId = parseInt(req.body.starId);

    client.query('DELETE FROM satellite_star WHERE satellite_id = $1 && star_id = $2', [satelliteId, starId], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send("Relationship deleted!");
    });
}

router.get('/satelliteStar/', (req, res) => getSatelliteStar(req, res));
router.post('/satelliteStar/', (req, res) => createSatelliteStar(req, res));
router.delete('/satelliteStar/', (req, res) => deleteSatelliteStar(req, res));

module.exports = router;