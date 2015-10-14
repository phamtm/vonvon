const React = require('react');

const Sticker = require('./Sticker');
const StickerItem = require('./StickerItem.jsx');


const EmoticonPopup = React.createClass({

  render: function() {
    var stickers = [];

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
