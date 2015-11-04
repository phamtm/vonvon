const React = require('react');
const classNames = require('classnames');

const StickerItem = require('./sticker-item.jsx');


const EmoticonPack = React.createClass({

  render: function() {
    const stickers = this.props.stickers;
    const packname = this.props.packname;
    const packClass = classNames(
      'emoticon-pack',
      { 'active': !!this.props.active }
    );
    var stickersDom = [];

    for (var stickerCode in stickers) {
      if (stickers.hasOwnProperty(stickerCode)) {
        const stickerDom = <StickerItem key={packname + stickerCode}
                                        stickerCode={stickerCode}
                                        sticker={stickers[stickerCode]} />;
        stickersDom.push(stickerDom);
      }
    }

    return (
      <div className={packClass}>
        {stickersDom}
      </div>
    );
  }

});

module.exports = EmoticonPack;
