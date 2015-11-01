const React = require('react');

const ChatMessageText = require('./chat-message-text.jsx');
const ChatMessageSticker = require('./chat-message-sticker.jsx');
const MessageType = require('../../constants/message-type');

const ChatCoalescedMessage = React.createClass({

  render: function() {
    const isYou = !!this.props.coalescedMessage.you;
    const authorName = this.props.coalescedMessage.authorName;

    const items = this.props.coalescedMessage.content.map(function(msg) {
      switch (msg.type) {
        case MessageType.TEXT:
          return <ChatMessageText key={msg.id} textMessage={msg.text} />;
        case MessageType.STICKER:
          return <ChatMessageSticker key={msg.id} stickerCode={msg.stickerCode} />;
        default:
          return null;
      }
    });

    return (
      <li className={ isYou ? 'chat-message-li-you' : 'chat-message-li' }>
        <div className={'message-author'}>
          <i className={'tiny material-icons'}>chat_bubble_outline</i> {authorName}
        </div>
        { items }
      </li>
    );
  }

});

module.exports = ChatCoalescedMessage;
