const express = require('express');
const app = express();
const mysql = require('mysql')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.send('Hello World!!'); 
});

const router = require('./routes/user.js')

app.use(router)

app.get('/api/courses/:year/:month', (req,res) => {
    res.send(req.params);
});

const port = process.env.port || 3100;

app.listen(port, () => console.log(`listening on port ${port}....`));