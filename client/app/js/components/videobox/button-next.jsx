const React = require('react');
const ConnectionStatus = require('../../constants/connection-status');
const connectionManager = require('../../connection-manager');
const Topics = require('../../constants/topics');


const ButtonNext = React.createClass({

  _handleClick: function() {
    connectionManager.emit(Topics.REQUEST_NEW_PARTNER);
  },

  render: function() {
    return (
      <button className="btn-justified-large button-next"
              onClick={this._handleClick} >
        Next
      </button>
    );
  }
});

module.exports = ButtonNext;
