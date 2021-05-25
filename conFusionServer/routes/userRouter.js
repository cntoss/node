var express = require('express');

const bodyParser = require('body-parser');
var cors = require('./cors');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();
router.use(bodyParser.json());
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', function (req, res, next) {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.status = 500;
        res.type('application/json');
        res.json({ err: err });
      } else {
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.status = 200;
            res.type('application/json');
            res.json({ status: "Registration Successful ", user: user });
          });

        });
      }
    });
});
router.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json({ success: false, status: 'Login unsuccess', err: info })
    }
    req.logIn(user, (err) => {
      if (err) {
        res.status(401).json({ success: false, status: 'login unsuccess', err: err });
      }
      var token = authenticate.getToken({ id: req.user._id });
      res.statusCode = 200;
      res.type('application/json');
      res.json({ success: true, token: token, status: "Successfully login" });
    });
  })(req, res, next);
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

router.get('/checkJWTTOken', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json({ success: false, status: 'JWT authorization failed', err: info });
    }
    res.json({ success: true, status: 'JWT is valid', user: user });

  })(req, res);
})
module.exports = router;
