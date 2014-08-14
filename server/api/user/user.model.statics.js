'use strict';

var Q = require('bluebird'),
    errors = loquire.config('errors');

exports.new = function(contents) {
  var deferred = Q.defer();

  this
    .create(contents, function(err, self) {
      if (err) {
        if (err.code === 11000) {
          return deferred.reject(new errors.UserDuplicatedError(contents.email));
        } else {
          return deferred.reject(err);
        }
      }

      deferred.resolve(self);
    });

  return deferred.promise;
};

exports.get = function(id, includeDeleted) {
  var deferred = Q.defer();

  var conditions = {
    _id: id
  };
  if (!includeDeleted) conditions.deleted_at = { $exists: false };

  this
    .findOne(conditions)
    .exec(function(err, self) {
      if (err) {
        if (err.name === 'CastError' && err.type === 'ObjectId') {
          return deferred.reject(new errors.UserNotFoundError(id));
        } else {
          return deferred.reject(err);
        }
      }

      if (!self) return deferred.reject(new errors.UserNotFoundError(id));

      deferred.resolve(self);
    });

  return deferred.promise;
};

exports.getByEmail = function(email, includeDeleted) {
  var deferred = Q.defer();

  var conditions = {
    email: email.toLowerCase()
  };
  if (!includeDeleted) conditions.deleted_at = { $exists: false };

  this
    .findOne(conditions)
    .exec(function(err, self) {
      if (err) return deferred.reject(err);

      if (!self) return deferred.reject(new errors.UserNotFoundError(email));

      deferred.resolve(self);
    });

  return deferred.promise;
};

exports.list = function(options) {
  var deferred = Q.defer();

  var query = this.find();

  query.where('deleted_at').exists(false);
  query.select('-salt -hashed_password -device');

  if (options.name)
    query.where('name').equals(new RegExp(options.name, 'i'));
  if (options.email)
    query.where('email').equals(new RegExp(options.email, 'i'));

  var sort = options.sort;
  query.where(sort.by);
  if (sort.lt) query.lt(sort.lt);
  if (sort.lte) query.lte(sort.lte);
  if (sort.gt) query.gt(sort.gt);
  if (sort.gte) query.gte(sort.gte);
  query.sort((sort.desc ? '-' : '') + sort.by);
  if (options.limit) query.limit(options.limit);

  query.exec(function(err, selves) {
    if (err) return deferred.reject(err);

    deferred.resolve(selves);
  });

  return deferred.promise;
};

exports.modify = function(coditions, contents) {
  var deferred = Q.defer();

  this.update(coditions, contents, function(err, n) {
    if (err) return deferred.reject(err);

    deferred.resolve(n);
  });

  return deferred.promise;
};

exports.delete = function(conditions) {
  return this.modify(conditions, {
    deleted_at: new Date()
  });
};
