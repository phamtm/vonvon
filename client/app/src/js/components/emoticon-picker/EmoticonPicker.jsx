var React = require('react');

var EmoticonPopup = require('./EmoticonPopup.jsx');
var emoticons = require('./emoticons');


var EmoticonPicker = React.createClass({

  getInitialState: function() {
    return {
      popupActive: false
    };
  },

  togglePopup: function() {
    this.setState({
      popupActive: !this.state.popupActive
    });
  },

  render: function() {
    return (
      <li className={"emoticon-picker"}>
        <i className={"small material-icons"} onClick={this.togglePopup}>mood</i>
        { this.state.popupActive ? <EmoticonPopup /> : null }
      </li>
    );
  }

});

module.exports = EmoticonPicker;
