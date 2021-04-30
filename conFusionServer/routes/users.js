var express = require('express');

const bodyParser = require('body-parser');
var User = require('../models/user');
const e = require('express');
var router = express.Router();

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', function (req, res, next) {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {
        var err = new Error('User ' + req.body.username + ' already exist');
        err.status = 403;
        return next(err);
      } else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        })
          .then((user) => {
            res.status = 200;
            res.type('application/json');
            res.json({ status: "Registration Successful ", user: user });
          }, (err) => next(err))
      }
    })
    .catch((err) => next(err));
});

router.post('/login', function (req, res, next) {

  console.log(req.session);

  if (!req.session.user) {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    console.log(username);
    User.findOne({ username: username })
      .then((user) => {
        if (user == null) {
          var err = new Error('Username ' + username + ' doest not exist');
          err.status = 403;
          return next(err);
        } else if (user.password != password) {
          var err = new Error('Your password is incorrect');
          err.status = 403;
          return next(err);
        } else if (user.username == username && user.password == password) {
          // authorized
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.type('text/plain');
          res.end('You are authenticated');
        }
      })
      .catch((err) => next(err));
  } else {
    res.status = 200;
    res.type('text/plain');
    res.end('You are already authenticated');
  }
});

router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
});

module.exports = router;
