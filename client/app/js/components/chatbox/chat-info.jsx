const React = require('react');
const connectionManager = require('../../connection-manager');

const ChatInfo = React.createClass({

  getInitialState: function() {
    return {
      partnerId: connectionManager._peerId
    };
  },

  componentDidMount: function() {
    connectionManager.onPartnerIdChanged(function() {
      this.setState({
        partnerId: connectionManager._peerId
      });
    }.bind(this));
  },

  render: function() {
    var msg = null;
    if (!!this.state.partnerId) {
      msg = <span>You're chatting with <strong>{this.state.partnerId}</strong></span>;
    } else {
      msg = <span>You're not matched. <strong>Press next to find a partner</strong></span>;
    }

    return (
      <li className={'chat-message-li chat-info'}>
        <div className='message-text'>
          {msg}
        </div>
      </li>
    );
  }

})

module.exports = ChatInfo;
