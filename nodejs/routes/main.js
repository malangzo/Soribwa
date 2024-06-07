const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');
const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require('dotenv').config();

app.get('/path', function(req, res) {
    const fastapi = process.env.fastapi;
    console.log(fastapi);
    res.json({ fastapi: fastapi });
});

module.exports = app;