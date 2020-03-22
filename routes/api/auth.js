const router = require('express').Router({mergeParams: true});
var bcrypt = require('bcryptjs');
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const authUser = (req, response) => {
    const {email, password} = req.body;
    client.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
        if (error){
            throw error;
        }
        if (result.rows.length === 0){
            response.status(401).send("Inform a valid email address")
        } else {
            bcrypt.compare(password, result.rows[0].password, function(err, res) {
                if (res){
                    response.status(200).send("User logged in!");
                } else {
                    response.status(401).send("Wrong password!!");
                }
            });
        }
    });
}


router.post('/auth/', (req, res) => authUser(req, res));

module.exports = router;