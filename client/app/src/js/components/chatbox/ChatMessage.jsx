var React = require('react');


var ChatMessage = React.createClass({
  render: function() {
    return (
      <li className={'chat-message-li'}>
        <h5 className={'message-author'}>
          <i className={'tiny material-icons'}>chat_bubble_outline</i> {this.props.message.authorName}
        </h5>
        <div className={'message-text'}>{this.props.message.text}</div>
      </li>
    );
  }
});

module.exports = ChatMessage;
