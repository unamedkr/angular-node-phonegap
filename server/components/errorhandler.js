'use strict';

var status = function(err) {
  switch (err.code) {
    case 'AUTHENTICATION_REQUIRED':
    case 'AUTHENTICATION_INVALID':
    case 'TOKEN_INVALID':
    case 'TOKEN_EXPIRED':
      return 401;
    case 'NOT_SELF':
      return 403;
    case 'USER_NOT_FOUND':
    case 'API_NOT_FOUND':
      return 404;
    case 'USER_DUPLICATED':
    case 'USER_MISMATCH':
    case 'PASSWORD_MISMATCH':
      return 409;
    case 'FIELD_REQUIRED':
    case 'FIELD_INVALID':
    case 'PARAM_REQUIRED':
    case 'PARAM_INVALID':
      return 422;
    default:
      console.error('err:', err);
      console.error(err.stack);
      return 500;
  }
};

exports = module.exports = function errorHandler() {
  /* jshint unused: false */
  return function errorHandler(err, req, res, next) {
    res.statusCode = status(err);
    var error = { message: err.message };
    for (var prop in err) error[prop] = err[prop];
    var json = JSON.stringify({ error: error });
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
  };
};
