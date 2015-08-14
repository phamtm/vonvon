module.exports = {

  convertRawMessage: function(rawMessage, you) {
  	var authorName = you ? '<You>' : '<Stranger>';

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
      date: new Date(timestamp),
      text: text,
    };
  }

};
