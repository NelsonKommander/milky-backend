const router = require('express').Router({mergeParams: true});
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getStarInSystem = (req, res) => {
    client.query('SELECT * FROM star_in_system ORDER BY system_id ASC', (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createStarInSystem = (req, res) => {
    const starId = parseInt(req.body.starId);
    const systemId = parseInt(req.body.systemId);
    if (!isNaN(starId) && !isNaN(systemId)){
        client.query('INSERT INTO star_in_system (star_id, system_id) VALUES ($1, $2)',
        [starId, systemId],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send("Relationship added with sucess!");
        });
    } else {
        res.status(401).send("Provide both ids (star and system)!");
    }
};

const deleteStarInSystem = (req, res) => {
    const starId = parseInt(req.body.starId);
    const systemId = parseInt(req.body.systemId);

    client.query('DELETE FROM star_in_system WHERE star_id = $1 && system_id = $2', [starId, systemId], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send("Relationship deleted with sucess!");
    });
}

router.get('/starInSystem/', (req, res) => getStarInSystem(req, res));
router.post('/starInSystem/', (req, res) => createStarInSystem(req, res));
router.delete('/starInSystem/', (req, res) => deleteStarInSystem(req, res));

module.exports = router;