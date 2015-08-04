const PORT = 8002;

const async = require('async');
const redis = require('redis');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const uuid = require('node-uuid');

// Who is waiting
var isWaiting = {};

const bodyParser = require('body-parser');
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

  handleSocketConnectionError(socket, redisClient, clientId);

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

/*=============================== UTILITY ===================================*/
/**
 * Unsubscribe from redis, remove waiting id, end the redis connection
 * @param  {[type]} redisClient [description]
 * @param  {[type]} clientId    [description]
 * @return {[type]}             [description]
 */
var cleanUpRedis = function (redisClient, clientId) {
  redisClient.unsubscribe(clientId, function () {
    redisClient.zrem('queue', clientId, function () {
      redisClient.end();
    });
  });
};

/**
 * Handle SocketIO Connection error
 * @param  socket      socket connection
 * @param  redisClient redis connection
 * @param  clientId    id of the current user`
 */
var handleSocketConnectionError = function (socket, redisClient, clientId) {
  // SocketIO Connection error handling
  socket.on('connect_error', function() {
    cleanUpRedis(redisClient, clientId);
  });

  socket.on('connect_timeout', function() {
    cleanUpRedis(redisClient, clientId);
  });

  socket.on('reconnect_error', function() {
    cleanUpRedis(redisClient, clientId);
  });

  socket.on('reconnect_failed', function() {
    cleanUpRedis(redisClient, clientId);
  });

  socket.on('disconnect', function() {
    cleanUpRedis(redisClient, clientId);
  });
  // End of SocketIO Connection error handling
};
