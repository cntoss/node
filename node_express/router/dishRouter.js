const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.route('/')
.all((req, res, next) => {
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

