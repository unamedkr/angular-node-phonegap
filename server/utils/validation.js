'use strict';

var Q = require('bluebird'),
    _ = require('lodash'),
    errors = loquire.config('errors');

exports.email = function(email) {
  return Q.try(function() {
    var test = (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i).test(email);
    if (!test) throw new errors.FieldInvalidError('email');

    return email;
  });
};

exports.requires = function(contents, requireds) {
  return Q.try(function() {
    var required = _.find(requireds, function(key) {
      return !contents[key];
    });

    if (required) throw new errors.FieldRequiredError(required);

    return contents;
  });
};

exports.remains = function(contents, valids) {
  return Q.try(function() {
    _.forOwn(contents, function(value, key) {
      if (!_.contains(valids, key)) delete contents[key];
    });

    return contents;
  });
};

exports.requiresAndRemains = function(contents, requireds, valids) {
  return exports.requires(contents, requireds)
    .then(function() {
      return exports.remains(contents, valids);
    });
};

exports.options = function(options) {
  return Q.try(function() {
    if (!options) options = {};
    if (!options.sort) options.sort = {};
    if (!options.sort.by) options.sort.by = 'created_at';
    if (!options.sort.desc) options.sort.desc = false;

    return options;
  });
};
