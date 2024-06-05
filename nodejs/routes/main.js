const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.post('/cycle/record-save', (req, res) => {
    const filePath = 'TEST.wav';

    // 요청 본문(req.body)에 있는 바이너리 데이터를 파일로 저장
    fs.writeFileSync(filePath, req.body);

    try {
        const response = axios.post('http://13.125.186.170:3000/cycle/record-analyze', formData, {

        });
        console.log(response.data);
    } catch (error) {
        console.error('There was an error!', error);
    }

});


module.exports = app;