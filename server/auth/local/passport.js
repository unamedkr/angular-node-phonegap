'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserService = loquire.user('service');

exports.setup = function () {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      UserService
        .authenticate({
          email: email,
          password: password
        })
        .then(function(user) {
          return done(null, user);
        })
        .catch(function(err) {
          return done(err);
        });
    }
  ));
};
