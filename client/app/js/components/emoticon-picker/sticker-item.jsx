const React = require('react');

const Dispatcher = require('../../dispatcher');
const connectionManager = require('../../connection-manager');
const Topics = require('../../constants/topics');


const StickerItem = React.createClass({

  sendStickerMessage: function() {
    connectionManager.sendStickerMessage(this.props.stickerCode);
    Dispatcher.emit(Topics.CLOSE_EMOTICON_PICKER);
  },

  render: function() {
    return (
      <div className={"emoticon-picker-popup-emoticon"}
           onClick={this.sendStickerMessage}>
           <i className={"emoticon-sprite " + this.props.sticker.className}></i>
      </div>
    );
  }

});

module.exports = StickerItem;
