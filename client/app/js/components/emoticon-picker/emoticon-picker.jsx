const React = require('react');

const Dispatcher = require('../../dispatcher');
const EmoticonPopup = require('./emoticon-popup.jsx');


const EmoticonPicker = React.createClass({

  getInitialState: function() {
    return {
      popupActive: false
    };
  },

  componentDidMount: function() {
    Dispatcher.addChatCloseListener(this.closePopup);
  },

  componentWillUnmount: function() {
    // unsubscribe events here
  },

  closePopup: function() {
    this.setState({
      popupActive: false
    });
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
        <EmoticonPopup active={this.state.popupActive} />
      </li>
    );
  }

});

module.exports = EmoticonPicker;
