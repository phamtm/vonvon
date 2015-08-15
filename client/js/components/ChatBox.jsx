var React = require('react');

var State = require('../State');
var ConnectionStatus = require('../constants/ConstConnectionStatus');
var Message = require('../Message');


const ENTER_KEY_CODE = 13;

var ChatMessage = React.createClass({
  render: function() {
    return (
      <li className={'chat-message'}>
        <h5 className={'message-author'}>{this.props.message.authorName}</h5>
        <div className="message-time">{this.props.message.date.toLocaleString()}</div>
        <div className={'message-text'}>{this.props.message.text}</div>
      </li>
    );
  }
});

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

  componentDidUpdate: function() {
    this._scrollToBottom();
  },

  _scrollToBottom: function() {
    var ul = this.refs.messageList.getDOMNode();
    ul.scrollTop = ul.scrollHeight;
  },

  render: function() {
    var items = this.state.chatMessages.map(function(msg) {
      return <ChatMessage key={msg.id} message={msg} />
    });
    return (
      <ul ref="messageList" className={'chat-message-list'}>
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
      if (this.state.message && this.state.message.length) {
        var rawMessage = Message.getCreatedMessageData(this.state.message);
        console.log(rawMessage.date);
        State.sendChat(rawMessage);
      }
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
    if (this.state.message && this.state.message.length) {
      var rawMessage = Message.getCreatedMessageData(this.state.message);
      State.sendChat(rawMessage);
    }
    this.setState({
      message: '',
      disabled: State.getState() !== ConnectionStatus.MATCHED
    });
  },

  componentDidMount: function() {
    State.onStateChange(this.handleStateChange);
  },

  render: function() {
    return (
      <div>
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
