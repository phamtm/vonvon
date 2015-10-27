const React = require('react');

const Sticker = require('../emoticon-picker/sticker');


const ChatMessageSticker = React.createClass({
  render: function() {
    const message = this.props.message;
    return (
      <li className={ message.you ? 'chat-message-li-you' : 'chat-message-li' }>
        <div className={'message-author'}>
          <i className={'tiny material-icons'}>chat_bubble_outline</i> {message.authorName}
        </div>
        <div className={'message-sticker'}>
          <i className={"emoticon-sprite " + Sticker[message.content.stickerCode].className}></i>
        </div>
      </li>
    );
  }
});

module.exports = ChatMessageSticker;
