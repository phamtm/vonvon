var React = require('react');

var ChatInput = require('./ChatInput.jsx');
var ChatMessageList = require('./ChatMessageList.jsx');
var EmoticonSidebar = require('../emoticon-sidebar/EmoticonSidebar.jsx');


var ChatBox = React.createClass({
  render: function() {
    return (
      <div className="right">

        <div className="chatbox-holder">
          <div className="chat-messages-holder">
            <ChatMessageList />
          </div>
          <ChatInput />
        </div>

        <EmoticonSidebar />
      </div>
    );
  }
});

module.exports = ChatBox;
