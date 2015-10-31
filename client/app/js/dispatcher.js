const EventEmitter = require('events').EventEmitter;
const Topics = require('./constants/topics');

const Dispatcher = function() {
  EventEmitter.call(this);
};

Dispatcher.prototype = Object.create(EventEmitter.prototype);

Dispatcher.prototype.addChatCloseListener = function(cb) {
  this.addListener(Topics.CLOSE_EMOTICON_PICKER, cb);
};

Dispatcher.prototype.addOnNewMessageListener = function(cb) {
  this.addListener(Topics.CLOSE_EMOTICON_PICKER, cb);
};

module.exports = new Dispatcher();
