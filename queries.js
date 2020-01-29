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

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    authUser,
}