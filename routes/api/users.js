const router = require('express').Router({mergeParams: true});
var bcrypt = require('bcryptjs');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'kommander',
    password: 'Kommander030500',
    host: 'localhost',
    database: 'api',
    port: 5432
});

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getUserById = (req, res) => {
    const userId = parseInt(req.params.userId);

    pool.query('SELECT * FROM users WHERE user_id = $1', [userId], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const createUser = (req, res) => {
    console.log(req.body);
    const {name, email, password} = req.body;
    console.log(`Nome: ${name}, Email: ${email}, Senha: ${password}`);

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hash], (error, results) => {
                if(error){
                    throw error;
                }
                res.status(201).send(`User added with ID: ${results.insertID}`);
            });
        });
    });
};

const updateUser = (req, res) => {
    const userId = parseInt(req.params.userId);
    const {name, email, password} = req.body;

    pool.query('UPDATE users SET name = $1, email = $2, WHERE user_id = $3',
    [name, email, userId],
    (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send(`User modified with ID: ${userId}`);
    });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
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