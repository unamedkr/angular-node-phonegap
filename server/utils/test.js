'use strict';

var Q = require('bluebird'),
    _ = require('lodash'),
    mongoose = loquire.config('mongoose');

// NOTE Mongoose models to be deleteed
// when TestUtils.clear() was called.
var MODELS = ['User'];

var remove = function(model) {
  var deferred = Q.defer();
  model.remove(function(err) {
    if (err) return deferred.reject(err);
    else return deferred.resolve();
  });
  return deferred.promise;
};

// NOTE convenient method for promise and done.
// See TestUtils.clear() for an example.
Q.prototype.shouldPass = function(done) {
  this.then(function() { done(); }, done).done();
};
Q.prototype.shouldFail = function(done, callback) {
  this
    .then(function() {
      throw new Error('This should have failed, but has passed.');
    }, callback)
    .then(function() { done(); }, done).done();
};

module.exports = {
  clear: function(done) {
    Q.all(_.map(MODELS, function(name) {
      return remove(mongoose.model(name));
    }))
    .shouldPass(done);
  }
};
