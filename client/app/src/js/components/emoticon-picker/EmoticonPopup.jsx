var React = require('react');

var Sticker = require('./Sticker');
var StickerItem = require('./StickerItem.jsx');


var EmoticonPopup = React.createClass({

  render: function() {
    const stickers = Sticker.map(function(sticker) {
      return <StickerItem key={sticker.stickerCode} sticker={sticker} />;
    });

    return (
      <div className={"emoticon-picker-popup z-depth-1"}>
        {stickers}
      </div>
    );
  }

});

module.exports = EmoticonPopup;
