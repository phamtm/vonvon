const React = require('react');

const ChatInput = require('./chat-input.jsx');
const ChatMessageList = require('./chat-message-list.jsx');


const ChatBox = React.createClass({

  render: function() {
    return (
      <div className="right">

        <div className="chatbox-holder">
          <ChatMessageList />
          <ChatInput />
        </div>

      </div>
    );
  }

});

module.exports = ChatBox;
