'use strict';

var errors = loquire.config('errors');

var hasAuthorization = exports.hasAuthorization = function(checker, err) {
  return function(req, res, next) {
    if (!checker(req)) {
      return next(err);
    }
    next();
  };
};

exports.isSelf = hasAuthorization(function(req) {
  return req.params.user === req.me.id;
}, new errors.NotSelfError());
