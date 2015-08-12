var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var ConstActionType = require('../constants/ConstActionType');
var STREAM_EVENT = 'stream_change';

var _localStream = null;
var _remoteStream = null;

var StreamStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(STREAM_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(STREAM_EVENT, callback);
  },

  getLocalStream: function() {
  	return _localStream;
  },

  getRemoteStream: function() {
  	return _remoteStream;
  },

});

var handlePayload = function(payload) {
  var action = payload.action;

  switch(action.type) {
    case ConstActionType.SET_LOCAL_STREAM:
      _localStream = action.stream;
      StreamStore.emitChange();
      break;

    case ConstActionType.SET_REMOTE_STREAM:
      _remoteStream = action.stream;
      StreamStore.emitChange();
      break;

    default:
      break;
  }
};

StreamStore.dispatchToken = AppDispatcher.register(handlePayload);

module.exports = StreamStore;
