var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");

var ConstConnectionStatus = require('../constants/ConstConnectionStatus');
var ConnectionStatusStore = require('../stores/ConnectionStatusStore');
var ConstActionType = require('../constants/ConstActionType');
var CHATBOX_CHANGE_EVENT = 'chatbox_change';

var _chatMessages = [];
var _peerDataConnection = null;

var ChatMessageListStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHATBOX_CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHATBOX_CHANGE_EVENT, callback);
  },

  getChatMessages: function() {
    return _chatMessages;
  }

});

var handlePayload = function(payload) {
  var action = payload.action;

  switch(action.type) {
    case ConstActionType.CALL_CLOSED_PASSIVELY:
    case ConstActionType.BUTTON_NEXT:
      _chatMessages = [];
      ChatMessageListStore.emitChange();
      break;

    case ConstActionType.CHAT_MESSAGE_RECEIVED:
      if (ConnectionStatusStore.getStatus() !== ConstConnectionStatus.CONNECTED) {
        return;
      }
      console.log('handle chat received');
      _chatMessages.push('recv');
      ChatMessageListStore.emitChange();
      break;

    case ConstActionType.CHAT_MESSAGE_SUBMITTED:
      if (ConnectionStatusStore.getStatus() !== ConstConnectionStatus.CONNECTED) {
        return;
      }
      console.log('handle chat submitted');
      _chatMessages.push('sub');
      _peerDataConnection.send(action.chatMessage);
      ChatMessageListStore.emitChange();
      break;

    case ConstActionType.PEER_DATA_CONNECTION_CREATED:
      if (ConnectionStatusStore.getStatus() !== ConstConnectionStatus.CONNECTED) {
        return;
      }
      console.log('setting peerData');
      _peerDataConnection = action.peerDataConnection;
      ChatMessageListStore.emitChange();
      break;

    default:
      // do nothing
  }
};

ChatMessageListStore.dispatchToken = AppDispatcher.register(handlePayload);

module.exports = ChatMessageListStore;
