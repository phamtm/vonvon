const React = require('react');

const ChatInput = require('./ChatInput.jsx');
const ChatMessageList = require('./ChatMessageList.jsx');


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
