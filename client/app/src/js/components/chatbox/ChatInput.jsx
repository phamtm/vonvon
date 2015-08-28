var React = require('react');

// var EmoticonPicker = require('../emoticon-picker/EmoticonPicker.jsx');
var EmoticonPicker = require('../emoticon-picker/EmoticonPicker.jsx');
var State = require('../../State');
var ConnectionStatus = require('../../constants/ConnectionStatus');
var MessageUtil = require('../../utils/MessageUtil');


const ENTER_KEY_CODE = 13;

var ChatInput = React.createClass({

  getInitialState: function() {
    return {
      message: '',
      disabled: true
    };
  },

  handleKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      this.setState({
        message: '',
        disabled: State.getState() !== ConnectionStatus.MATCHED
      });
      State.sendChat(this.state.message);
    }
  },

  handleValueChange: function(event) {
    this.setState({ message: event.target.value });
  },

  handleStateChange: function() {
    this.setState({
      message: ''
    });
  },

  handleClick: function() {
    if (this.state.message && this.state.message.length) {
      State.sendChat(this.state.message);
    }
    this.setState({
      message: '',
      disabled: State.getState() !== ConnectionStatus.MATCHED
    });
  },

  handleChatChannelOpened: function() {
    this.setState({
      message: '',
      disabled: false
    });
  },

  handleChatChannelClosed: function() {
    this.setState({
      message: '',
      disabled: true
    });
  },

  componentDidMount: function() {
    State.onStateChange(this.handleStateChange);
    State.onChatChannelOpened(this.handleChatChannelOpened);
    State.onChatChannelClosed(this.handleChatChannelClosed);
  },

  render: function() {
    return (
      <div className="chatInput">
        <input type="text" value={this.state.message}
               disabled={this.state.disabled}
               onChange={this.handleValueChange}
               onKeyDown={this.handleKeyDown} />
        <button className={"waves-effect waves-light btn"}
                type="button"
                onClick={this.handleClick}
                disabled={this.state.disabled || !this.state.message.length}>
          Submit
        </button>
        <EmoticonPicker />
      </div>
    );
  }
});

module.exports = ChatInput;