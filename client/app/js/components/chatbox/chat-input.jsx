const React = require('react');

const connectionManager = require('../../connection-manager');
const ConnectionStatus = require('../../constants/connection-status');
const MessageUtils = require('../../utils/message-utils');
const EmoticonPicker = require('../emoticon-picker/emoticon-picker.jsx');


const ENTER_KEY_CODE = 13;

const ChatInput = React.createClass({

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
        disabled: connectionManager.getState() !== ConnectionStatus.MATCHED
      });
      connectionManager.sendTextMessage(this.state.message);
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
      connectionManager.sendTextMessage(this.state.message);
    }
    this.setState({
      message: '',
      disabled: connectionManager.getState() !== ConnectionStatus.MATCHED
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
    connectionManager.onStateChange(this.handleStateChange);
    connectionManager.onChatChannelOpened(this.handleChatChannelOpened);
    connectionManager.onChatChannelClosed(this.handleChatChannelClosed);
  },

  render: function() {
    return (
      <div className={"chat-input-area"}>
        <div className={"chat-input-holder"}>
          <input id="chat-input"
                 type="text"
                 autofocus={!this.state.disabled}
                 placeholder={this.state.disabled ? 'Press next' : 'Type a message...'}
                 value={this.state.message}
                 disabled={this.state.disabled}
                 onChange={this.handleValueChange}
                 onKeyDown={this.handleKeyDown}  />
        </div>
        <ul className={"chat-actions"}>
          <li>
            <i className={"small material-icons"} onClick={this.handleClick}
               disabled={this.state.disabled || !this.state.message.length}>
              send
            </i>
          </li>
          <EmoticonPicker />
        </ul>
      </div>
    );
  }

});

module.exports = ChatInput;
