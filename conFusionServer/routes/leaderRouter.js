const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all leaderRouter information to you');
})
.post((req, res, next) => {
    res.end('Will send leaderRouter: ' + req.body.name + 
    ' with details ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 401;
    res.end('Put operation did not supported on /leaderRouter');
})
.delete((req, res, next) => {
    res.end('Deleting all leaderRouter information');
});


leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end(`Will send all leader of  ${req.params.leaderId} information to you`);
})
.post((req, res, next) => {
    res.statusCode = 401;
    res.end(`Post operation did not supported on /leader/${req.params.leaderId}`);
})
.put((req, res, next) => {   
    res.end('Will send leader: ' + req.body.name + 
    ' with details ' + req.body.description + ' of the ' + req.params.leaderId);
})
.delete((req, res, next) => {
    res.end(`Deleting ${req.params.leaderId} leaderRouter information`);
});

module.exports = leaderRouter;