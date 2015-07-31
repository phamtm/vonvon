const PORT = 8002;

const async = require('async');
const redis = require('redis');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const uuid = require('node-uuid');

const bodyParser = require('body-parser');
// Who is waiting
var isWaiting = {};

app.use(bodyParser.json()); // for parsing application/json

// Redis setup

server.listen(PORT, function () {
  console.log('Server listening at port %d', PORT);
});

io.on('connection', function (socket) {
  console.log('new client');
  const redisClient = redis.createClient();

  // Generate a random UUID
  const clientId = uuid.v4();
  isWaiting[clientId] = false;
  socket.clientId = clientId;
  console.log('Client::' + clientId);

  io.on('connect_error', function() {
    redisClient.unsubscribe(clientId);
    redisClient.zrem('queue', clientId);
  });

  io.on('connect_timeout', function() {
    redisClient.unsubscribe(clientId);
    redisClient.zrem('queue', clientId);
  });

  io.on('reconnect_error', function() {
    redisClient.unsubscribe(clientId);
    redisClient.zrem('queue', clientId);
  });

  io.on('reconnect_failed', function() {
    redisClient.unsubscribe(clientId);
    redisClient.zrem('queue', clientId);
  });

  io.on('disconnect', function() {
    redisClient.unsubscribe(clientId);
    redisClient.zrem('queue', clientId);
  });

  socket.emit('connection-created', {
    id: clientId
  });

  socket.on('request-new-partner', function(data) {
    // the user is already in waiting queue
    if (isWaiting[clientId]) {
      return;
    }

    // register the user in the waiting queue
    isWaiting[clientId] = true;

    // Subscribe to redis channel
    redisClient.zadd('queue', Math.random(), clientId, function() {
      redisClient.subscribe(clientId);
    });
  });

  // the user has been matched with another
  redisClient.on('message', function (channel, message) {
    isWaiting[clientId] = false;

    console.log('Partner created::' + message);
    redisClient.unsubscribe(clientId);
    socket.emit('matched', {
      partnerId: message
    });
  });
});
