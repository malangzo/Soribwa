const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require('dotenv').config();

const fastapi = process.env.FASTAPI;


app.get('/cycle/graph', async (req, res) => {

    try {
        const response = await axios.get(`${fastapi}/cycle/draw-graph`);

        if (response.status === 200) {
            const data = response.data;
            //const img_base64 = `data:image/png;base64,${data}`;
            //const img_buffer = Buffer.from(img_base64, 'base64');
            //fs.writeFileSync(imageFilePath, img_buffer);


            return res.status(200).json({ status: 200, message: 'Graph drawn successfully', image: data });
        } else {
           
            const errorData = response.data;
            const errorMessage = errorData.detail || 'Error during fetch';
            return res.status(response.status).json({ status: response.status, message: errorMessage });
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return res.status(500).json({ status: 500, message: 'Error during fetch' });
    }
});


module.exports = app;
