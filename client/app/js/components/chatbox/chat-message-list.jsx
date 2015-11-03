const React = require('react');

const ChatCoalescedMessage = require('./chat-coalesced-message.jsx');
const ChatInfo = require('./chat-info.jsx');
const ChatMessageText = require('./chat-message-text.jsx');
const ChatMessageSticker = require('./chat-message-sticker.jsx');
const connectionManager = require('../../connection-manager');


const ChatMessageList = React.createClass({

  getInitialState: function() {
    return {
      chatMessages: connectionManager.getMessages()
    };
  },

  componentDidMount: function() {
    connectionManager.onMessageChange(this._onChatMessageListChange);
  },

  _onChatMessageListChange: function() {
    this.setState({
      chatMessages: connectionManager.getMessages()
    });
  },

  componentDidUpdate: function() {
    this._scrollToBottom();
  },

  _scrollToBottom: function() {
    // const ul = this.refs.holder.getDOMNode();
    // ul.scrollTop = ul.scrollHeight;
  },

  render: function() {
    const messages = this.state.chatMessages;
    const coalescedMessages = [];

    var curMsg = null;
    if (messages.length > 0) {
      messages[0].content.id = messages[0].id;
      curMsg = {
        authorName: messages[0].authorName,
        you: messages[0].you,
        content: [messages[0].content]
      };
    }

    for (var i = 1; i < messages.length; i++) {
      messages[i].content.id = messages[i].id;
      if (messages[i].authorName !== curMsg.authorName) {
        coalescedMessages.push(curMsg);
        curMsg = {
          authorName: messages[i].authorName,
          you: messages[i].you,
          content: [messages[i].content]
        };
      } else {
        curMsg.content.push(messages[i].content);
      }
    }

    if (!!curMsg) {
      coalescedMessages.push(curMsg);
    }

    const chatMessageDoms = coalescedMessages.map(function(msg, idx) {
      return (
        <ChatCoalescedMessage coalescedMessage={msg} key={ 'coalescedMessage' + idx} />
      );
    });

    return (
      <div className="chat-messages-holder" ref="holder">
        <ul className='chat-message-ul'>
          <ChatInfo />
          { chatMessageDoms }
        </ul>
      </div>
    );
  }
});

module.exports = ChatMessageList;
