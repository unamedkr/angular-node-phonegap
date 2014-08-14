/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('static-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');
var path = require('path');
var passport = require('passport');
var config = loquire.config();
var errorhandler = loquire.components('errorhandler');
var cors = loquire.components('cors');
var redirection = loquire.components('redirection');

var app = express();

var env = app.get('env');

if ('production' === env) {
  app.use(redirection());
}

app.use(compression());

if ('production' === env) {
  app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
  app.use(express.static(path.join(config.root, 'public')));
  app.set('public', config.root + '/public');
}

if ('development' === env || 'test' === env) {
  app.use(require('connect-livereload')());
  app.use(express.static(path.join(config.root, '.tmp')));
  app.use(express.static(path.join(config.root, 'client')));
  app.set('public', config.root + '/client');
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ dest: './.tmp/'}));
app.use(methodOverride());
app.use(passport.initialize());
app.use(morgan('dev'));

app.route('/api/*')
  .all(cors({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Auth-Token'],
    credentials: true,
    maxAge: 86400
  }));

loquire.config('routes')(app);

app.use(errorhandler());

var server = require('http').createServer(app);
loquire.config('socketio')(server);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

module.exports = app;
