const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all dishes information to you');
})
.post((req, res, next) => {
    res.end('Will send dishe: ' + req.body.name + 
    ' with details ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 401;
    res.end('Put operation did not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all dishes information');
});

module.exports = dishRouter;