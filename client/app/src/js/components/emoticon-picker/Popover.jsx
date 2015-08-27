var React = require('react');

var EmoticonItem = require('./EmoticonItem.jsx');


var Popover= React.createClass({

  render: function() {
    const emoticonItems = this.props.emoticons.map(function(item) {
      return <EmoticonItem key={item.id} src={item.src}/>;
    });

    return (
      <div className="emoticon-picker-popover">
        {{emoticonItems}}
      </div>
    );
  }

});

module.exports = Popover;
