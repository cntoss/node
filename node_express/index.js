const bodyParser = require('body-parser');
const express = require('express');
const dishRouter = require('./router/dishRouter');
http = require('http');
morgan = require('morgan');
bodyParse = require('body-parser');

const dishROuter = require('./router/dishRouter');

const hostname = 'localhost';
const port = '3000';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use('/dishes', dishRouter);

app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is express.js examle</h1></body></html>');
});


const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
})