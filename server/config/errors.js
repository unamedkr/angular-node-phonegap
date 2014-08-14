'use strict';

/* THE BASE ERROR */

function LINKError(name, code, message) {
  var e = Error.call(this, message);
  e.name = name;
  e.code = code;
  return e;
}

/* AUTHENTICATION ERRORS: 401 */

function AuthenticationRequiredError(message) {
  message = message || 'No Authorization header was found.';
  return LINKError.call(this, 'AuthenticationRequiredError', 'AUTHENTICATION_REQUIRED', message);
}

function AuthenticationInvalidError(message) {
  message = message || 'The given Authorization header format is bad.';
  return LINKError.call(this, 'AuthenticationInvalidError', 'AUTHENTICATION_INVALID', message);
}

function TokenInvalidError(message) {
  message = message || 'The given token is not valid.';
  return LINKError.call(this, 'TokenInvalidError', 'TOKEN_INVALID', message);
}

function TokenExpiredError(message) {
  message = message || 'The given token is expired.';
  return LINKError.call(this, 'TokenExpiredError', 'TOKEN_EXPIRED', message);
}

/* AUTHORIZATION ERRORS: 403 */

function NotSelfError(message) {
  message = message || 'You are trying to modify other, not you.';
  return LINKError.call(this, 'NotSelfError', 'NOT_SELF', message);
}

/* NOT FOUND ERRORS: 404 */

function UserNotFoundError(id, message) {
  message = message || 'User:' + id + ' is not found.';
  var e = LINKError.call(this, 'UserNotFoundError', 'USER_NOT_FOUND', message);
  e.id = id;
  return e;
}

function ApiNotFoundError(url, message) {
  message = message || 'No resource for url:' + url + ' is found.';
  var e = LINKError.call(this, 'ApiNotFoundError', 'API_NOT_FOUND', message);
  e.url = url;
  return e;
}

/* CONFLICT ERRORS: 409 */

function UserDuplicatedError(email, message) {
  message = message || 'User:' + email + ' already exists.';
  var e = LINKError.call(this, 'UserDuplicatedError', 'USER_DUPLICATED', message);
  e.email = email;
  return e;
}

function UserMismatchError(email, message) {
  message = message || 'User:' + email + ' is not found.';
  var e = LINKError.call(this, 'UserMismatchError', 'USER_MISMATCH', message);
  e.email = email;
  return e;
}

function PasswordMismatchError(email, message) {
  message = message || 'Password for user:' + email + ' is invalid.';
  var e = LINKError.call(this, 'PasswordMismatchError', 'PASSWORD_MISMATCH', message);
  e.email = email;
  return e;
}

/* UNPROCESSABLE ENTITY ERRORS: 422 */

function FieldRequiredError(field, message) {
  message = message || 'The field:' + field + ' is required.';
  var e = LINKError.call(this, 'FieldRequiredError', 'FIELD_REQUIRED', message);
  e.field = field;
  return e;
}

function FieldInvalidError(field, message) {
  message = message || 'The field:' + field + ' is not valid.';
  var e = LINKError.call(this, 'FieldInvalidError', 'FIELD_INVALID', message);
  e.field = field;
  return e;
}

function ParamRequiredError(param, message) {
  message = message || 'The param:' + param + ' is required.';
  var e = LINKError.call(this, 'ParamRequiredError', 'PARAM_REQUIRED', message);
  e.param = param;
  return e;
}

function ParamInvalidError(param, message) {
  message = message || 'The param:' + param + ' is not valid.';
  var e = LINKError.call(this, 'ParamInvalidError', 'PARAM_INVALID', message);
  e.param = param;
  return e;
}

module.exports = {
  AuthenticationRequiredError: AuthenticationRequiredError,
  AuthenticationInvalidError: AuthenticationInvalidError,
  TokenInvalidError: TokenInvalidError,
  TokenExpiredError: TokenExpiredError,
  NotSelfError: NotSelfError,
  UserNotFoundError: UserNotFoundError,
  ApiNotFoundError: ApiNotFoundError,
  UserDuplicatedError: UserDuplicatedError,
  UserMismatchError: UserMismatchError,
  PasswordMismatchError: PasswordMismatchError,
  FieldRequiredError: FieldRequiredError,
  FieldInvalidError: FieldInvalidError,
  ParamRequiredError: ParamRequiredError,
  ParamInvalidError: ParamInvalidError
};
