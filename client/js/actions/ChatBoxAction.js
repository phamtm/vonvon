var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ConstActionType = require('../constants/ConstActionType');


var ButtonAction = {

  setPeerDataConnection: function(peerDataConnection) {
    AppDispatcher.handleServerAction({
      type: ConstActionType.PEER_DATA_CONNECTION_CREATED,
      peerDataConnection: peerDataConnection
    });
  },

  receivedChatMessage: function(chatMessage) {
    AppDispatcher.handleServerAction({
      type: ConstActionType.CHAT_MESSAGE_RECEIVED,
      chatMessage: chatMessage
    });
  },

  submitChatMessage: function(chatMessage) {
    if (_.isEmpty(chatMessage)) {
      return;
    }

  	AppDispatcher.handleViewAction({
  		type: ConstActionType.CHAT_MESSAGE_SUBMITTED,
      chatMessage: chatMessage
  	});
  }
};

module.exports = ButtonAction;
