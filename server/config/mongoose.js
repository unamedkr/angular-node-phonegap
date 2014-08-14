'use strict';

var config = loquire.config(),
    mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    _ = require('lodash');

mongoose.connect(config.mongo.uri, config.mongo.options);

var connection = mongoose.connection;
var db = connection.db;
var mongo = mongoose.mongo;

if (connection.hosts) {
  console.log('Mongoose connected to', _.map(connection.hosts, function(connection) {
    return connection.host + ':' + connection.port + '/' + db.databaseName;
  }));
} else {
  console.log('Mongoose connected to', connection.host + ':' + connection.port + '/' + db.databaseName);
}

var gfs = new Grid(db, mongo);

mongoose.gfs = gfs;

module.exports = exports = mongoose;
