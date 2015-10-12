const EventEmitter = require('events').EventEmitter;

const Dispatcher = function() {
  EventEmitter.call(this);
};


Dispatcher.prototype.addChatCloseListener = function(cb) {
  this.addListener(Topics.CLOSE_EMOTICON_PICKER, cb);
};

Dispatcher.prototype = Object.create(EventEmitter.prototype);


module.exports = new Dispatcher();
