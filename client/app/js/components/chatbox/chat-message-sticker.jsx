const React = require('react');

const Sticker = require('../emoticon-picker/sticker');


const ChatMessageSticker = React.createClass({
  render: function() {
    return (
      <div className={'message-sticker'}>
        <i className={"emoticon-sprite " + Sticker[this.props.stickerCode].className}></i>
      </div>
    );
  }
});

module.exports = ChatMessageSticker;
