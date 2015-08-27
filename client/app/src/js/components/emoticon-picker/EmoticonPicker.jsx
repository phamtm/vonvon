var React = require('react');

var Popover = require('./Popover.jsx');
var emoticons = require('./emoticons');


var EmoticonPicker = React.createClass({

  render: function() {
    return (
      <div className="emoticon-picker">
        <button className="emoticon-picker-button waves-effect waves-light btn">Emoticon</button>
        <Popover emoticons={emoticons} />
      </div>
    );
  }

});

module.exports = EmoticonPicker;
