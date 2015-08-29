var React = require('react');

var State = require('../../State');


var StickerItem = React.createClass({

  sendStickerMessage: function() {
    State.sendStickerMessage(this.props.sticker.stickerCode);
  },

  render: function() {
    return (
      <div className={"emoticon-picker-popup-emoticon"} onClick={this.sendStickerMessage}>
        <img src={this.props.sticker.src} alt="emoticon" />
      </div>
    );
  }

});

module.exports = StickerItem;
