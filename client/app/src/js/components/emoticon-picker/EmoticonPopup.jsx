var React = require('react');

var Sticker = require('./Sticker');
var StickerItem = require('./StickerItem.jsx');


var EmoticonPopup = React.createClass({

  render: function() {
    const stickers = [];

    for (var stickerCode in Sticker) {
      if (Sticker.hasOwnProperty(stickerCode)) {
        var sticker = <StickerItem key={stickerCode} stickerCode={stickerCode}
                                   sticker={Sticker[stickerCode]} />;
        stickers.push(sticker);
      }
    }

    return (
      <div className={"emoticon-picker-popup z-depth-1"}>
        {stickers}
      </div>
    );
  }

});

module.exports = EmoticonPopup;
