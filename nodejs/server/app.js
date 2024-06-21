const express = require('express')
const morgan = require('morgan')
const path = require('path')
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()


app.set('port', process.env.PORT || 8000)

var main = require('./routes/main.js')
app.use('/', main)


app.listen(app.get('port'), () => {
    console.log('8000 Port: Server Started~!!')
});
