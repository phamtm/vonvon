const React = require('react');
const ConnectionStatus = require('../../constants/connection-status');
const connectionManager = require('../../connection-manager');
const Topics = require('../../constants/topics');
const log = require('../../utils/log');


const ButtonNextInitial = React.createClass({

  _handleClick: function() {
    log.debug('initClick');
    connectionManager.emit(Topics.REQUEST_NEW_PARTNER);
  },

  render: function() {
    return (
      <button className="btn-justified-large"
              onClick={this._handleClick} >
        Find someone
      </button>
    );
  }
});

module.exports = ButtonNextInitial;
