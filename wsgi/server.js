const PORT = 3000;

const redis = require('redis');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const uuid = require('node-uuid');

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
  socket.clientId = clientId;
  console.log('Client::' + clientId);

  socket.emit('connection-created', {
    id: clientId
  });

  socket.on('request-new-partner', function(data) {
    // Subscribe to redis channel
    redisClient.subscribe(clientId);
  })

  redisClient.zadd('queue', Math.random(), clientId);

  redisClient.on('message', function (channel, message) {
    console.log('Partner created::' + message);
    redisClient.unsubscribe(clientId);
    socket.emit('matched', {
      partnerId: message
    });
  })
})
