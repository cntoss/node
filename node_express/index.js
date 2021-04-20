const bodyParser = require('body-parser');
const express = require('express');
http = require('http');
morgan = require('morgan');
bodyParse = require('body-parser');

const hostname = 'localhost';
const port = '3000';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.all('/dishes', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    next();
});


app.get('/dishes', (req, res, next) => {
    res.end('Will send all dishes information to you');
});

app.post('/dishes', (req, res, next) => {
    res.end('Will send dishe: ' + req.body.name + 
    ' with details ' + req.body.description);
});

app.put('/dishes', (req, res, next) => {
    res.statusCode = 401;
    res.end('Put operation did not supported on /dishes');
});

app.delete('/dishes', (req, res, next) => {
    res.end('Deleting all dishes information');
});

//for single id
app.get('/dishes/:dishId', (req, res, next) => {
    res.end('Will send details of dish ' +
    req.params.dishId + ' to you');
});

app.post('/dishes/:dishId', (req, res, next) => {
    res.statusCode = 401;
    res.end('Post operation did not supported on /dishes/' +
    req.params.dishId);
});

app.put('/dishes/:dishId', (req, res, next) => {
    res.write('Updationg the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + 
    ' with details: ' + req.body.description);
});

app.delete('/dishes/:dishId', (req, res, next) => {
    res.end('Deleting dishe ' + req.params.dishId);
});

app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is express.js examle</h1></body></html>');
});


const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
})