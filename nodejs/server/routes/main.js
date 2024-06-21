const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require('dotenv').config();

const fastapi = process.env.FASTAPI;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './routes');
    },
    filename: function (req, file, cb) {
        cb(null, 'recording.wav');
    }
});

const upload = multer({ storage });

app.post('/cycle/record-send', upload.single('file'), async (req, res) => {
    console.log('File uploaded successfully:', req.file);
    const { filename, path } = req.file;

    // 파일을 읽어 Buffer로 변환
    const fileBuffer = fs.readFileSync(path);

    const apiUrl = `${fastapi}/cycle/record-analyze`;

    const formData = new FormData();
    formData.append('file', fileBuffer, { filename }); // Buffer를 append

    try {
        const response = await axios.post(apiUrl, formData, {
            headers: {
                ...formData.getHeaders(), // FormData의 헤더를 가져옵니다.
            },
        });

        console.log('Server response:', response.data);
        res.send('File uploaded and sent successfully to FastAPI server.');
    } catch (error) {
        console.error('Error sending file to FastAPI server:', error);
        res.status(500).send('Error sending file to FastAPI server.');
    }

});

module.exports = app;
