const React = require('react');


const ChatMessageText = React.createClass({

  render: function() {
    const message = this.props.message;
    return (
      <li className={ message.you ? 'chat-message-li-you' : 'chat-message-li' }>
        <div className={'message-author'}>
          <i className={'tiny material-icons'}>chat_bubble_outline</i> {message.authorName}
        </div>
        <div className={'message-text'}>{message.content.text}</div>
      </li>
    );
  }

});

module.exports = ChatMessageText;
