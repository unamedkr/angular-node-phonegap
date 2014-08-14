'use strict';

var express = require('express');
var passport = require('passport');
var authentication = loquire.components('authentication');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) return next(err);

    authentication.sign(user);

    res.finish({
      data: user
    });
  })(req, res, next);
});

module.exports = router;
