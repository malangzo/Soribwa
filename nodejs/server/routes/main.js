const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const request = require('request');
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

var client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
var client_secret = process.env.REACT_APP_NAVER_CLIENT_SECRET;
var state = "true";

// var redirectURI = encodeURI(process.env.REACT_APP_NAVER_REDIRECT_URI);
var redirectURI = encodeURI('https://www.soribwa.com/login');
var api_url = "";
const encodeBody = "";

app.get('/callback', async function (req, res) {
    code = req.query.code;
    state = req.query.state;
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
     console.log("node check1")
    await request.get(options, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
        console.log("node check2");

        var option = {
            url: 'https://openapi.naver.com/v1/nid/me',
            headers: {'Authorization': `Bearer ${JSON.parse(body).access_token}`
            }
        }
        console.log("option check", option)
        console.log("first url check: ", api_url)
        // console.log("first response check: ", response)

        await request.get(option, async function (error1, response1, body1) {
            if (!error1 && response1.statusCode == 200) {
                // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                console.log("node check 2-2");
                console.log("node check 2-2 body",body1);
                // console.log("node check 2-2 nickname0",body1.response.nickname);
                let encodeBody = JSON.parse(body1);
                console.log("node check 2-2 nickname1",encodeBody.response.nickname);
                console.log("node check 2-2 nickname1",encodeBody.response.profile_image);
                console.log("result: ", encodeBody);
                
                data = {
                    "email": encodeBody.response.id,
                    "password":"1111",
                    "name": encodeBody.response.nickname,
                    // "img": encodeBody.response.profile_image
                }
                //const url = 'http://ec2-15-165-71-22.ap-northeast-2.compute.amazonaws.com:5400/user';

                
                await axios({method: 'POST', url, data, headers:{
                    'Content-Type': 'application/json; charset=utf-8'
                }}).then((response3) => {
                    console.log(`statusCode: ${response3.status}`)
                    console.log(response3.data)
                    let encodeBody = JSON.parse(body1);
                    res.redirect(`https://www.soribwa.com/NaverLoginSave?id=${encodeBody.response.id}&nickname=${encodeBody.response.nickname}&img=${encodeBody.response.profile_image}`)
                }).catch((error3) => {
                    console.error(error3)
                })



            } else {
                // res.status(response1.statusCode).end();
                console.log('error1 = ' + response1.statusCode);
            }
        })
      } else {
        // res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  });



module.exports = app;
