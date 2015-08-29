var React = require('react');

var Sticker = require('../emoticon-picker/Sticker');


var ChatMessageSticker = React.createClass({
  render: function() {
    var message = this.props.message;
    return (
      <li className={ message.you ? 'chat-message-li-you' : 'chat-message-li' }>
        <div className={'message-author'}>
          <i className={'tiny material-icons'}>chat_bubble_outline</i> {message.authorName}
        </div>
        <div className={'message-sticker'}>
          <img src={Sticker[message.content.stickerCode].src}
               alt={message.content.stickerCode}/>
        </div>
      </li>
    );
  }
});

module.exports = ChatMessageSticker;
