module.exports = {

  convertRawMessage: function(rawMessage, authorName) {
    return {
      id: rawMessage.id,
      authorName: authorName,
      date: new Date(rawMessage.timestamp),
      text: rawMessage.text,
    };
  },

  getCreatedMessageData: function(text) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      timestamp: timestamp,
      text: text,
    };
  }

};
