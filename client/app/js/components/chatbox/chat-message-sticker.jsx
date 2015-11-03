const React = require('react');

const StickerPacks = require('../emoticon-picker/sticker-packs');


const ChatMessageSticker = React.createClass({
  render: function() {
    return (
      <div className={'message-sticker'}>
        <i className={'emoticon-sprite ' + StickerPacks[0]['stickers'][this.props.stickerCode]['className'] }></i>
      </div>
    );
  }
});

module.exports = ChatMessageSticker;
