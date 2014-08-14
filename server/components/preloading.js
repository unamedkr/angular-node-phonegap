'use strict';

var User = loquire.user('service');

exports.requiresMe = function(req, res, next) {
  User.preload(req.login.id)
  .then(function(user) {
    req.me = user;
    next();
  })
  .catch(function(err) {
    next(err);
  });
};

exports.requiresUser = function(req, res, next) {
  User.preload(req.params.user)
  .then(function(user) {
    req.user = user;
    next();
  })
  .catch(function(err) {
    next(err);
  });
};
