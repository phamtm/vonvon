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
var isChatting = {};

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

  socket.emit('connection-created', {
    id: clientId
  });

  socket.on('request-new-partner', function(data) {
    var partnerId = data.id;

    // the user is already in waiting queue
    if (isWaiting[clientId]) {
      return;
    }

    // register the user in the waiting queue
    isWaiting[clientId] = true;
    isChatting[clientId] = false;

    // Subscribe to redis channel
    redisClient.zadd('queue', Math.random(), clientId);
    redisClient.subscribe(clientId);
  });

  // the user has been matched with another
  redisClient.on('message', function (channel, message) {
    isChatting[clientId] = true;
    isWaiting[clientId] = false;

    console.log('Partner created::' + message);
    redisClient.unsubscribe(clientId);
    socket.emit('matched', {
      partnerId: message
    });
  });
});
