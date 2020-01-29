const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/createRouter.js')();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({extended: true})
);

app.get('/', (req, res) => {
    res.json({info: 'Node.js, Express and Postgres API'})
});

app.use('/api', router);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}.`);
});