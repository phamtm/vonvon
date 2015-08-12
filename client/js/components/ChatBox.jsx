var React = require('react');
var ChatBoxAction = require('../actions/ChatBoxAction');
var ChatMessageListStore = require('../stores/ChatMessageListStore');


var ChatMessageList = React.createClass({

  getInitialState: function() {
    return {
      chatMessages: ChatMessageListStore.getChatMessages()
    };
  },

  componentDidMount: function() {
    ChatMessageListStore.addChangeListener(this._onChatMessageListChange);
  },

  _onChatMessageListChange: function() {
    this.setState({
      chatMessages: ChatMessageListStore.getChatMessages()
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

var ChatInputText = React.createClass({
  render: function() {
    return (
      <input type="text"/>
    );
  }
});

var ChatSubmitButton = React.createClass({
  handleClick: function() {
    ChatBoxAction.submitChatMessage('test');
  },

  render: function() {
    return (
      <button className={"waves-effect waves-light btn"} type="button" onClick={this.handleClick}>
        Submit
      </button>
    );
  }
});

var ChatInput = React.createClass({
  render: function() {
    return (
      <div>
        <ChatInputText />
        <ChatSubmitButton />
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
