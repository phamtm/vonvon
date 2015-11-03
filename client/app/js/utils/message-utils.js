const MessageType = require('../constants/message-type');


const MessageUtils = {

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
    const timestamp = Date.now();
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
    const timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      timestamp: timestamp,
      content: {
        type: MessageType.STICKER,
        stickerCode: stickerCode,
      }
    };
  },

  convertToMediaStreamControlMessage: function(turnMediaStreamOn) {
    const timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      timestamp: timestamp,
      content: {
        type: MessageType.MEDIA_STREAM_CONTROL,
        mediaStreamOn: !!turnMediaStreamOn
      }
    };
  }

};

module.exports = MessageUtils;
