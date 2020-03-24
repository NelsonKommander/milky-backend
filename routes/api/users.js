const router = require('express').Router({mergeParams: true});
var bcrypt = require('bcryptjs');
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

const getUsers = (req, res) => {
    client.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getUserById = (req, res) => {
    const userId = parseInt(req.params.userId);

    client.query('SELECT * FROM users WHERE user_id = $1', [userId], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createUser = (req, res) => {
    const {name, email, password} = req.body;
    if (name != null && email != null && password != null && password != ""){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                client.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hash], (error, results) => {
                    if(error){
                       if (error.code == 23505){
                           res.status(401).send("Email is already in use!");
                       } else {
                            throw error;
                       }
                    } else {
                        res.status(201).send("User added sucessfully!");
                    }
                });
            });
        });
    } else {
        res.status(401).send("Invalid user information!");
    }
};

const updateUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const {name, email, password} = req.body;
    if (name != null && email != null && password != null && password != ""){
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(password, salt, function(err, hash){
                client.query('UPDATE users SET name = $1, email = $2, password = $3 WHERE user_id = $4',
                [name, email, hash, userId],
                (error, results) => {
                    if(error){
                        throw error;
                    }
                    res.status(200).send(`User modified with ID: ${userId}`);
                });
            });
        });
    } else {
        res.status(401).send("Invalid input data!");
    }
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    client.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send(`User deleted with ID: ${id}`);
    });
}

router.get('/users/', (req, res) => getUsers(req, res));
router.get('/users/:id', (req, res) => getUserById(req, res));
router.post('/users/', (req, res) => createUser(req, res));
router.put('/users/:id', (req, res) => updateUser(req, res));
router.delete('/users/:id', (req, res) => deleteUser(req, res));

module.exports = router;