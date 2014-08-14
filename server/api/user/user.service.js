'use strict';

var Q = require('bluebird'),
    errors = loquire.config('errors'),
    User = loquire.user('model'),
    ValidationUtil = loquire.utils('validation');

exports.create = function(contents) {
  return ValidationUtil
    .requiresAndRemains(
      contents,
      ['email', 'password', 'name'],
      ['email', 'password', 'name', 'description']
    )
    .then(function(contents) {
      return ValidationUtil
        .email(contents.email);
    })
    .then(function() {
      return User.new(contents);
    })
    .then(function(user) {
      user.groups = [];
      return user;
    });
};

var convertError = function(err, email) {
  if (err.name === 'UserNotFoundError') {
    return new errors.UserMismatchError(email);
  } else {
    return err;
  }
};

exports.authenticate = function(contents) {
  return ValidationUtil
    .requires(contents, ['email', 'password'])
    .then(function(contents) {
      return User.getByEmail(contents.email);
    })
    .catch(function(err) {
      throw convertError(err, contents.email);
    })
    .then(function(user) {
      return user.authenticate(contents.password);
    });
};

exports.preload = function(id) {
  return User.get(id);
};

exports.read = function(user) {
  return Q.resolve(user);
};

exports.list = function(options) {
  return ValidationUtil
    .options(options)
    .then(function(options) {
      return User.list(options);
    });
};

exports.update = function(user, contents) {
  return ValidationUtil
    .remains(contents, ['name', 'description'])
    .then(function(contents) {
      return user.persist(contents);
    });
};

exports.delete = function(user) {
  return user.delete();
};

exports.password = {
  update: function(user, contents) {
  return ValidationUtil
    .requires(contents, ['old', 'new'])
    .then(function() {
      return user.authenticate(contents.old);
    })
    .then(function() {
      return user.persist({ password: contents.new });
    });
  }
};
