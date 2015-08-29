var React = require('react');

var MessageType = require('../../constants/MessageType');
var Sticker = require('../emoticon-picker/Sticker');


var ChatMessage = React.createClass({
  render: function() {
    var message = this.props.message;
    var text;
    if (message.content.type === MessageType.TEXT) {
      text = message.content.text;
    } else {
      text = message.content.stickerCode;
    }
    return (
      <li className={'chat-message-li'}>
        <h5 className={'message-author'}>
          <i className={'tiny material-icons'}>chat_bubble_outline</i> {message.authorName}
        </h5>
        <div className={'message-text'}>{text}</div>
      </li>
    );
  }
});

module.exports = ChatMessage;
