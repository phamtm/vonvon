var React = require('react');
var ChatInput = require('./ChatInput.jsx');
var ChatMessageList = require('./ChatMessageList.jsx');


var ChatBox = React.createClass({
  render: function() {
    return (
      <div className={"card"}>
        <div className={"card-content"}>
          <div>
            <h4>Chat box</h4>
            <ChatMessageList />
            <ChatInput />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ChatBox;
