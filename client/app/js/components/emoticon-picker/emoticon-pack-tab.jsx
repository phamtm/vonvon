const React = require('react');

const StickerPacks = require('./sticker-packs');
const EmoticonPackTabItem = require('./emoticon-pack-tab-item.jsx');


const EmoticonPackTab = React.createClass({

  getInitialState: function() {
    return {
      activePack: this.props.initialActivePackName
    };
  },

  changeActivePack: function(packname) {
    this.setState({
      activePack: packname
    });
    this.props.onClick(packname);
  },

  render: function() {
    const handler = this.changeActivePack;
    const activePackName = this.state.activePack;
    const tabItems = StickerPacks.map(function(stickerPack) {
      const packname = stickerPack.packname;
      return (
        <EmoticonPackTabItem key={packname}
                             packname={packname}
                             onClick={handler.bind(this, packname)}
                             active={packname === activePackName} />
      );
    }, this);

    return (
      <div className="emoticon-tab">
        <ul className="emoticon-tab-ul">
          { tabItems }
          <li className={"emoticon-tab-li reveal-more"}>&gt;&gt;</li>
        </ul>
      </div>
    );
  }

})

module.exports = EmoticonPackTab;
