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

const storage = multer.memoryStorage({})

const upload = multer({
    storage: storage
})

const fastapi = process.env.Fastapi;


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

app.post('/cycle/daygraph', async (req, res) => {
    try {
        const { startdate, enddate } = req.body;
        console.log('Received dates:', startdate, enddate);

        const response = await axios.post(`${fastapi}/cycle/draw-day-graph`, { startdate, enddate }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });


        if (response.status === 200) {
            const data = response.data;
            if(data.message == 'No data'){ 
                return res.status(200).json({ status: 200, message: 'No data' });
            } else {
                return res.status(200).json({ status: 200, message: 'Graph drawn successfully', image: data.image });
            }
        } else {
            const errorData = response.data;
            const errorMessage = errorData.detail || 'Error during fetch';
            return res.status(response.status).json({ status: response.status, message: errorMessage });
        }
    } catch (error) {
        console.error('Error during fetch:', error.message);
        return res.status(500).json({ status: 500, message: 'Error during fetch' });
    }
});

app.post('/audio_test', upload.single("file"), async (req, res) => {

    const formData = new FormData();
    formData.append("file", req.file.buffer, { filename: req.file.originalname });
    formData.append("timestamp", req.body.timestamp);


    await axios.post(`${fastapi}/cycle/record-analyze`, formData, {
    })
    .then(function (result) {
        console.log("result status check: ", result.status);
        console.log("result data check: ", result.data);
        return res.status(200).json({ status: 200, data: result.data });
        
    }).catch(function (error) {
        console.log(error)
    })

})



module.exports = app;
