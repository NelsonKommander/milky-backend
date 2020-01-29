const router = require('express').Router({mergeParams: true});

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'kommander',
    password: 'Kommander030500',
    host: 'localhost',
    database: 'api',
    port: 5432
});

const authUser = (req, res) => {
    /*const {email, password} = req.body;
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
        if(error){
            throw error;
        }
        if(result.rows.length === 0){
            res.status(404).send('false');
        } else {
            res.status(200).send('true');
        }
    });*/
    res.status(200).send(true);
}


router.post('/auth/', (req, res) => authUser(req, res));

module.exports = router;