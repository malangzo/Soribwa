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

app.get('/team_one', function(req, res) {
    const team_one = process.env.Team_One;
    console.log(team_one);
    res.redirect(team_one);
});

module.exports = app;