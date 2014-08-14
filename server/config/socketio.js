'use strict';

var jwt = require('jsonwebtoken'),
    config = loquire.config();

var verify = function(token, callback) {
  jwt.verify(token, config.token.secret, {}, function(err, login) {
    if (!err) callback(login);
  });
};

var socketio;

module.exports = exports = function(server) {
  socketio = require('socket.io')(server);

  if (process.env.NODE_ENV === 'production') {
    // Enables passing events between nodes.
    // Using socket.io-adapter specifically, socket.io-redis.
    var redis = require('socket.io-redis');
    socketio.adapter(redis({ host: config.redis.ip, port: config.redis.port }));
  }

  socketio.on('connection', function(socket) {
    var user;

    var login = function(login) {
      user = login;

      socket.join(user.id);
      console.log('A socket(' + socket.id + ') has joined to:', user.id);
    };

    var logout = function() {
      if (user) {
        socket.leave(user.id);
        console.log('A socket(' + socket.id + ') has left from:', user.id);
        user = undefined;
      }
    };

    socket.on('login', function(token) {
      if (token) {
        verify(token, login);
      }
    });

    socket.on('logout', logout);

    socket.on('disconnect', logout);
  });
};

exports.send = function(user, type, data) {
  socketio.to(user).emit(type, data);
};
