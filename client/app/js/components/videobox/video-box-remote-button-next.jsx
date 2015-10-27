const React = require('react');
const ConnectionStatus = require('../../constants/connection-status');
const connectionManager = require('../../connection-manager');
const Topics = require('../../constants/topics');


const VideoBoxRemoteButtonNext = React.createClass({

  getInitialState: function() {
    return {
      state: connectionManager.getState()
    };
  },

  _handleClick: function() {
    connectionManager.emit(Topics.REQUEST_NEW_PARTNER);
  },

  _handleStateChange: function() {
    this.setState({
      state: connectionManager.getState()
    });
  },

  componentDidMount: function() {
    connectionManager.onStateChange(this._handleStateChange);
  },

  render: function() {
    var label = (this.state.state === ConnectionStatus.REQUESTING) ? 'Requesting..' : 'Find someone';
    var disabled = this.state.state === ConnectionStatus.REQUESTING;
    return (
      <button disabled={disabled}
              onClick={this._handleClick}
              className="btn-justified-large">
        {label}
      </button>
    );
  }
});

module.exports = VideoBoxRemoteButtonNext;
