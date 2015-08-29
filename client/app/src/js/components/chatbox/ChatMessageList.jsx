var React = require('react');

var ChatMessageText = require('./ChatMessageText.jsx');
var ChatMessageSticker = require('./ChatMessageSticker.jsx');
var MessageType = require('../../constants/MessageType');
var State = require('../../State');


var ChatMessageList = React.createClass({

  getInitialState: function() {
    return {
      chatMessages: State.getMessages()
    };
  },

  componentDidMount: function() {
    State.onMessageChange(this._onChatMessageListChange);
  },

  _onChatMessageListChange: function() {
    this.setState({
      chatMessages: State.getMessages()
    });
  },

  componentDidUpdate: function() {
    this._scrollToBottom();
  },

  _scrollToBottom: function() {
    var ul = this.refs.messageList.getDOMNode();
    ul.scrollTop = ul.scrollHeight;
  },

  render: function() {
    var items = this.state.chatMessages.map(function(msg) {
      switch (msg.content.type) {
        case MessageType.TEXT:
          return <ChatMessageText key={msg.id} message={msg} />;
        case MessageType.STICKER:
          return <ChatMessageSticker key={msg.id} message={msg} />;
        default:
          return null;
      }
    });
    return (
      <ul ref="messageList" className={'chat-message-ul'}>
        {items}
      </ul>
    );
  }
});

module.exports = ChatMessageList;
