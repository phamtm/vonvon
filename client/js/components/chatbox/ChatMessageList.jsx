var React = require('react');

var ChatMessage = require('./ChatMessage.jsx');
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
      return <ChatMessage key={msg.id} message={msg} />
    });
    return (
      <ul ref="messageList" className={'chat-message-list'}>
        {items}
      </ul>
    );
  }
});

module.exports = ChatMessageList;
