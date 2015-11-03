const React = require('react');
const connectionManager = require('../../connection-manager');

const ChatInfo = React.createClass({

  getInitialState: function() {
    return {
      localId: connectionManager._localId,
      partnerId: connectionManager._peerId
    };
  },

  componentDidMount: function() {
    connectionManager.onPartnerIdChanged(function() {
      this.setState(this._getLocalAndPeerIds());
    }.bind(this));

    connectionManager.onLocalIdChanged(function() {
      this.setState(this._getLocalAndPeerIds());
    }.bind(this));
  },

  _getLocalAndPeerIds: function() {
    return {
      localId: connectionManager._localId,
      partnerId: connectionManager._peerId
    };
  },

  render: function() {
    var msgPartnerId = null;
    if (!!this.state.partnerId) {
      msgPartnerId = <span>You're chatting with <strong>{this.state.partnerId}</strong></span>;
    } else {
      msgPartnerId = <span>You're not matched. <strong>Press next to find a partner</strong></span>;
    }

    var msgLocalId = null;
    if (!!this.state.localId) {
      msgLocalId = <span>Hello <strong>{this.state.localId}</strong></span>;
    } else {
      msgLocalId = <span>Retrieving your chatname...</span>;
    }

    return (
      <li className={'chat-message-li chat-info'}>
        <div className='message-text'>
          {msgLocalId}
        </div>
        <div className='message-text'>
          {msgPartnerId}
        </div>
      </li>
    );
  }

})

module.exports = ChatInfo;
