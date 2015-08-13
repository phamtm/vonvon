var React = require('react');

var State = require('../State');
var ConnectionStatus = require('../constants/ConstConnectionStatus');


const ENTER_KEY_CODE = 13;

var ChatMessageList = React.createClass({

  getInitialState: function() {
    return {
      chatMessages: State.getMessages()
    };
  },

  componentDidMount: function() {
    State.onMessageChange(this._onChatMessageListChange);
  },

  _onChatMessageListChange: function() {
    this.setState({
      chatMessages: State.getMessages()
    });
  },

  render: function() {
    var items = this.state.chatMessages.map(function(msg) {
      return <li>{msg}</li>;
    });
    return (
      <ul>
        {items}
      </ul>
    );
  }
});

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
      message: '',
      disabled: State.getState() !== ConnectionStatus.MATCHED
    });
  },

  handleClick: function() {
    this.setState({
      message: '',
      disabled: State.getState() !== ConnectionStatus.MATCHED
    });
    State.sendChat(this.state.message);
  },

  componentDidMount: function() {
    State.onStateChange(this.handleStateChange);
  },

  render: function() {
    return (
      <div>
        <input type="text" value={this.state.message}
               onChange={this.handleValueChange}
               onKeyDown={this.handleKeyDown} />
        <button className={"waves-effect waves-light btn"}
                type="button"
                onClick={this.handleClick}
                disabled={this.state.disabled}>
          Submit
        </button>
      </div>
    );
  }
});

var ChatBox = React.createClass({
  render: function() {
    return (
      <div className={"card"}>
        <div className={"card-content"}>
          <div>
            <h4>Chat box</h4>
            <ChatMessageList />
            <ChatInput />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ChatBox;
