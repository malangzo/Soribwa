const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');
const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// app.get('/cycle/show-graph', (req, res) => {
//     image_path = '../public/images/img_buf.png'
//     console.log(image_path)
//     res.sendFile(image_path, { root: __dirname });
// });


module.exports = app;