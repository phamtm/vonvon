module.exports = {

  convertToPresentableMessage: function(message, authorName) {
    return {
      id: message.id,
      authorName: authorName,
      date: new Date(message.timestamp),
      text: message.text,
    };
  },

  convertToTransferableMessage: function(text) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      timestamp: timestamp,
      text: text,
    };
  }

};
