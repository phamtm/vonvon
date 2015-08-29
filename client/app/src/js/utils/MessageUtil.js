const MessageType = require('../constants/MessageType');


const MessageUtil = {

  convertToPresentableMessage: function(message, authorName, you) {
    return {
      id: message.id,
      authorName: authorName,
      date: new Date(message.timestamp),
      you: you,
      content: message.content
    };
  },

  convertToTransferableTextMessage: function(text) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      timestamp: timestamp,
      content: {
        type: MessageType.TEXT,
        text: text
      }
    };
  },

  convertToTransferableStickerMessage: function(stickerCode) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      timestamp: timestamp,
      content: {
        type: MessageType.STICKER,
        stickerCode: stickerCode,
      }
    };
  }

};

module.exports = MessageUtil;
