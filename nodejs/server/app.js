const express = require('express')
const morgan = require('morgan')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mainRoute = require('./routes/main');

const PORT = process.env.PORT || 8000;

// API 라우트
app.use('/api', mainRoute);

// React 정적 파일 제공
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log('8000 Port: Server Started~!!')
});
