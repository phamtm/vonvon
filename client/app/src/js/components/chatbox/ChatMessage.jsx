var React = require('react');


var ChatMessage = React.createClass({
  render: function() {
    return (
      <li className={'chat-message'}>
        <h5 className={'message-author'}>{this.props.message.authorName}</h5>
        <div className="message-time">{this.props.message.date.toLocaleString()}</div>
        <div className={'message-text'}>{this.props.message.text}</div>
      </li>
    );
  }
});

module.exports = ChatMessage;
