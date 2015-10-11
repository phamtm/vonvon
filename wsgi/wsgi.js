const PORT = 8002;

const redis = require('redis');
const app = require('express')();
const uuid = require('node-uuid');
const fs = require('fs');
const cors = require('cors');

app.use(cors());

var serverOptions = {
  key: fs.readFileSync('/home/ubuntu/keys/trananhcuong.key'),
  cert: fs.readFileSync('/home/ubuntu/keys/trananhcuong.crt'),
  ca: fs.readFileSync('/home/ubuntu/keys/geotrust2.pem')
};

const server = require('https').createServer(serverOptions, app);
const io = require('socket.io').listen(server);

//io.set( 'origins', '*www.vonvon.vn:*' );
io.set( 'origins', '*:*' );
GEN_ADJ = [ "autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark",
      "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter",
      "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue",
      "billowing", "broken", "cold", "damp", "falling", "frosty", "green",
      "long", "late", "lingering", "bold", "little", "morning", "muddy", "old",
      "red", "rough", "still", "small", "sparkling", "throbbing", "shy",
      "wandering", "withered", "wild", "black", "young", "holy", "solitary",
      "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine",
      "polished", "ancient", "purple", "lively", "nameless"];
GEN_NOUNS = [ "waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning",
      "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter",
      "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook",
      "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly",
      "feather", "grass", "haze", "mountain", "night", "pond", "darkness",
      "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder",
      "violet", "water", "wildflower", "wave", "water", "resonance", "sun",
      "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper",
      "frog", "smoke", "star"];

var genCoolId = function() {
  const l1 = GEN_ADJ.length;
  const l2 = GEN_NOUNS.length;
  const idx1 = Math.floor(Math.random() * l1);
  const idx2 = Math.floor(Math.random() * l2);
  return GEN_ADJ[idx1] + '-' + GEN_NOUNS[idx2];
};

// Who is waiting
var isWaiting = {};

server.listen(PORT, function () {
  console.log('Server listening at port %d', PORT);
});

io.on('connection', function (socket) {
  const redisClient = redis.createClient();

  // Generate a random UUID
  // const clientId = uuid.v1();
  const clientId = genCoolId();
  isWaiting[clientId] = false;
  socket.clientId = clientId;
  console.log(Date.now().toLocaleString() + ' Client::' + clientId);

  handleSocketConnectionError(socket, redisClient, clientId);

  socket.emit(
    'socket-io::connection-created',
    { id: clientId }
  );

  socket.on('socket-io::request-new-partner', function(data) {
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

    console.log(Date.now().toLocaleString() + ' Partner created::' + message);
    redisClient.unsubscribe(clientId);
    socket.emit(
      'socket-io::matched',
      { partnerId: message }
    );
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
