var express = require('express');

const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();
router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', function (req, res, next) {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.status = 500;
        res.setHeader('application/json');
        res.json({ err: err });
      } else {
        passport.authenticate('local')(req, res, () => {
          res.status = 200;
          res.type('application/json');
          res.json({ status: "Registration Successful ", user: user });
        });
      }
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ id: req.user._id });
  res.statusCode = 200;
  res.type('application/json');
  res.json({ success: true, token: token, status: "Successfully login" });
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
