var React = require('react');


var EmoticonItem = React.createClass({
  // image, tooltip, onclick -> return code
  handleClick: function() {
    console.log('clicked emoticon');
  },

  render: function() {
    return (
      <div className="emoticon-item" onClick={this.handleClick} >
        <img src={this.props.src} />
      </div>
    );
  }

});

module.exports = EmoticonItem;
