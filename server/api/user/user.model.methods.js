'use strict';

var Q = require('bluebird'),
    _ = require('lodash'),
    crypto = require('crypto'),
    errors = loquire.config('errors');

exports.makeSalt = function() {
  return crypto.randomBytes(16).toString('base64');
};

exports.encryptPassword = function(password) {
  if (!password || !this.salt) return '';
  var salt = new Buffer(this.salt, 'base64');
  return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
};

exports.authenticate = function(plainText) {
  var self = this;

  return Q.try(function() {
    if (self.encryptPassword(plainText) !== self.hashed_password)
      throw new errors.PasswordMismatchError(self.email);

    return self;
  });
};

exports.persist = function(contents) {
  var deferred = Q.defer();

  _.forOwn(contents, function(value, key) {
    this[key] = value;
  }, this);

  this.save(function(err, self) {
    if (err) return deferred.reject(err);

    deferred.resolve(self);
  });

  return deferred.promise;
};

exports.modify = function(contents) {
  var deferred = Q.defer();

  this.update(contents, function(err, n) {
    if (err) return deferred.reject(err);

    deferred.resolve(n);
  });

  return deferred.promise;
};

exports.delete = function() {
  return this.modify({
    deleted_at: new Date()
  });
};
