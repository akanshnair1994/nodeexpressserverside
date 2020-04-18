const express = require('express')
const mysql = require('mysql')
const router = express.Router()

router.get('/messages', (req, res) => {
    console.log("Show some message...")
    res.end()
});

router.get('/users', (req, res) => {
    console.log(`Fetching all the users`)

    const conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'akansh12345',
        database: 'restapiwithnode'
    })

    conn.query("SELECT * FROM users", (err, rows, fields) => {
        if (err) {
            console.log("Failed to query. " + err);
            res.sendStatus(500)
            return
        }

        console.log("Got the users....")

        const users = rows.map((row) => {
            return {
                id: row.id,
                firstName: row.first_name,
                lastName: row.last_name
            }
        })

        res.json(users)
    })
});

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'akansh12345',
    database: 'restapiwithnode'
})

function getConnection() {
    return pool
}

router.post('/create_user', (req,res) => {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const conn = getConnection();
    const queryString = "INSERT INTO users (first_name, last_name) VALUES (?, ?)";

    conn.query(queryString, [firstName, lastName], (err, results, fields)=> {
        if (err) {
            console.log("Failed to insert a new user: " + err)
            res.sendStatus(500)
            return
        }

        console.log(`Inserted a new user with id ${results.insertId}`);
        res.json({
            status: 200,
            message: 'User was added successfully'
        })
    })
})

router.get('/user/:id', (req, res) => {
    console.log(`Fetching the user with id ${req.params.id}`)

    const conn = getConnection()

    conn.query("SELECT * FROM users where id = ?", req.params.id, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query. " + err);
            res.end()
            return
        }

        console.log("Got the users....")
        res.json(rows)
    })
});

module.exports = router