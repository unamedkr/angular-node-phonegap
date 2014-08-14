'use strict';

// Enables redirection to https for production mode on AWS.
// This middleware should be at the first place.
module.exports = function() {
  return function(req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'http') {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  };
};
