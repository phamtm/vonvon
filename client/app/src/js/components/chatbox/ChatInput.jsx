var React = require('react');

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
      <div className={"chat-input-area"}>
        <div className={"chat-input-holder"}>
          <input id="chat-input" type="text" autofocus placeholder="Type a message..." />
        </div>
        <ul className={"chat-actions"}>
          <li><i className={"small material-icons"}>send</i></li>
          <li className={"emoticon-picker"}>
            <i className={"small material-icons"}>mood</i>
            <div className={"emoticon-picker-popup z-depth-1"}>
              <div className={"emoticon-picker-popup-emoticon"}>
                <img src="img/emoticons/haha.png" alt="emoticon" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = ChatInput;
