const router = require('express').Router({mergeParams: true});

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'kommander',
    password: 'Kommander030500',
    host: 'localhost',
    database: 'api',
    port: 5432
});

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    })
}

const createUser = (req, res) => {
    const {name, email} = req.body;

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if(error){
            throw error;
        }
        res.status(201).send(`User added with ID: ${result.insertID}`);
    })
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const {name, email} = req.body;

    pool.query('UPDATE users SET name = $1, email = $2, WHERE id = $3',
    [name, email, id],
    (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send(`User modified with ID: ${id}`);
    });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send(`User deleted with ID: ${id}`)
    })
}



router.get('/users/', (req, res) => getUsers(req, res));
router.get('/users/:id', (req, res) => getUserById(req, res));
router.post('/users/', (req, res) => createUser(req, res));
router.put('/users/:id', (req, res) => updateUser(req, res));
router.delete('/users/:id', (req, res) => deleteUser);

module.exports = router;