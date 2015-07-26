var redis = require('redis');
var redisClient = redis.createClient();
var RANDOM_QUEUE_NAME = 'queue';

redisClient.on('error', function(err) {
  console.log('Error:: ' + err);
})

redisClient.zadd(RANDOM_QUEUE_NAME, 0.1, 'a');
redisClient.zadd(RANDOM_QUEUE_NAME, 0.2, 'b');
redisClient.zadd(RANDOM_QUEUE_NAME, 0.3, 'c');
redisClient.zadd(RANDOM_QUEUE_NAME, 0.4, 'd');
redisClient.zadd(RANDOM_QUEUE_NAME, 0.5, 'e');
redisClient.zadd(RANDOM_QUEUE_NAME, 0.5, 'f');


redisClient.zcard(RANDOM_QUEUE_NAME, function(err, response) {
  if (+response > 1) {
    redisClient.zrange([RANDOM_QUEUE_NAME, 0, 1], function(err, response) {
      if (Object.prototype.toString.call(response) !== '[object Array]')
        return;

      if (response.length < 2)
        return;

      console.log(response);

      var id1 = response[0];
      var id2 = response[1];

      redisClient.multi()
        .zrem(RANDOM_QUEUE_NAME, id1)
        .zrem(RANDOM_QUEUE_NAME, id2)
        .exec(function(err, response) {
          redisClient.publish(id1, id2);
          redisClient.publish(id2, id1);
        });
    });
  }
});
