const React = require('react');

const StickerPacks = require('./sticker-packs');
const StickerItem = require('./sticker-item.jsx');


const EmoticonPopup = React.createClass({

  render: function() {
    const stickerPack = StickerPacks[0];
    const stickers = stickerPack.stickers;
    var stickersDom = [];

    for (var stickerCode in stickers) {
      if (stickers.hasOwnProperty(stickerCode)) {
        const stickerDom = <StickerItem key={StickerPacks[0].packname + stickerCode} stickerCode={stickerCode}
                                        sticker={stickers[stickerCode]} />;
        stickersDom.push(stickerDom);
      }
    }

    return (
      <div className={"emoticon-picker-popup z-depth-1"}>
        <div className="emoticon-tab">
          <ul className="emoticon-tab-ul">
            <li className="emoticon-tab-li">Pack 1</li>
            <li className="emoticon-tab-li">Pack 2</li>
            <li className="emoticon-tab-li">Pack 3</li>
            <li className="emoticon-tab-li">Pack 4</li>
            <li className={"emoticon-tab-li reveal-more"}>&gt;&gt;</li>
          </ul>
        </div>
        <div className="emoticon-pack">
          {stickersDom}
        </div>
      </div>
    );
  }

});

module.exports = EmoticonPopup;
