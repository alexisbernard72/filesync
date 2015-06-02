'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
var _ = require('lodash');

var logger = require('winston');
var config = require('./config')(logger);

app.use(express.static(path.resolve(__dirname, './public')));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(config.server.port, function () {
  logger.info('Server listening on %s', config.server.port);
});

var sio = io(server);

sio.set('authorization', function (handshakeData, accept) {
  // @todo use something else than a private `query`
  handshakeData.isAdmin = handshakeData._query.access_token === config.auth.token;
  accept(null, true);
});

// @todo extract in its own
sio.on('connection', function (socket) {
  socket.on('file:changed', function () {
    if (!socket.conn.request.isAdmin) {
      // if the user is not admin
      // skip this
      return socket.emit('error:auth', 'Unauthorized :)');
    }

    // forward the event to everyone
    sio.emit.apply(sio, ['file:changed'].concat(_.toArray(arguments)));
  });

  socket.visibility = 'visible';
  
  sio.emit('user:new', socket.conn.id, "");
  
  socket.on('disconnect', function () {
	sio.emit('user:remove', socket.conn.id);
  });

  socket.on('user-visibility:changed', function (state) {
    socket.visibility = state;
    sio.emit('users:visibility-states', getVisibilityCounts());
  });

  socket.on('chat:message:new', function (message) {
    sio.emit('chat:message:new', socket.conn.id, message);
  });

  socket.on('chat:wizz', function (message) {
    sio.emit('chat:wizz', socket.conn.id, message);
  });

  socket.on('message:private', function (socketId, message, f) {
    var from = socket.id;
    var to = socketId;

    var toSocket = _.find(sio.sockets, function (socket) {
      return socket.id === to;
    });

    if (toSocket) {
      return f(new Error('Socket not found'));
    }

    toSocket.emit('message:private', message);
    f(null, 'OK');
  });

});



function getVisibilityCounts() {
  return _.chain(sio.sockets.sockets).values().countBy('visibility').value();
}
