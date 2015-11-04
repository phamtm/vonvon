const React = require('react');

const StickerItem = require('./sticker-item.jsx');
const EmoticonPack = require('./emoticon-pack.jsx');
const EmoticonPackTab = require('./emoticon-pack-tab.jsx');
const StickerPacks = require('./sticker-packs');


const EmoticonPopup = React.createClass({

  getInitialState: function() {
    return {
      activePackName: StickerPacks[0].packname
    };
  },

  changeActiveTab: function(packname) {
    this.setState({
      activePackName: packname
    });
  },

  render: function() {
    const activePackName = this.state.activePackName;
    const stickerPacksDom = StickerPacks.map(function(pack) {
      const active = (activePackName === pack.packname);
      return (
        <EmoticonPack key={pack.packname} stickers={pack.stickers}
                      packname={pack.packname} active={active} />
        );
    });

    return (
      <div className={"emoticon-picker-popup z-depth-1"}>
        <EmoticonPackTab initialActivePackName={this.state.activePackName}
                         onClick={this.changeActiveTab} />
        { stickerPacksDom }
      </div>
    );
  }

});

module.exports = EmoticonPopup;
