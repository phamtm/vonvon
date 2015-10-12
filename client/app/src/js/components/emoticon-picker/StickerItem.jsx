const React = require('react');

const Dispatcher = require('../../Dispatcher');
const State = require('../../State');
const Topics = require('../../constants/Topics');


const StickerItem = React.createClass({

  sendStickerMessage: function() {
    State.sendStickerMessage(this.props.stickerCode);
    Dispatcher.emit(Topics.CLOSE_EMOTICON_PICKER);
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
