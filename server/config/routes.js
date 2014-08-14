/**
 * Main application routes
 */

'use strict';

var errors = loquire.config('errors'),
    ApiNotFoundError = errors.ApiNotFoundError;

module.exports = function(app) {
  app.use('/api/users', loquire.user());
  app.use('/api/auth', loquire.auth());

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|components|app|bower_components|assets)/*')
    .get(function(req, res, next) {
      next(new ApiNotFoundError(req.url));
    });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('public') + '/index.html');
    });
};
