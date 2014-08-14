'use strict';

var fs = require('fs'),
    path = require('path');

GLOBAL.loquire = {
  config: function(name) {
    name = name || 'environment';
    return require('./config/' + name);
  },
  components: function(name) {
    return require('./components/' + name);
  },
  utils: function(name) {
    return require('./utils/' + name);
  },
  auth: function(name) {
    if (name) {
      name = 'auth.' + name;
    } else {
      name = 'index';
    }
    return require('./auth/' + name);
  }
};

var traverse = function(directory, callback) {
  fs.readdirSync(path.join(__dirname, directory))
    .forEach(function(file) {
      var stat = fs.statSync(path.join(__dirname, directory, file));
      if (stat.isDirectory()) {
        callback(file);
      }
    });
};

traverse('api', function(domain) {
  loquire[domain] = function(name) {
    if (name) {
      name = domain + '.' + name;
    } else {
      name = 'index';
    }
    return require('./api/' + domain + '/' + name);
  };
});
