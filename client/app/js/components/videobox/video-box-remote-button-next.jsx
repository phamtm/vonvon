const React = require('react');
const ConnectionStatus = require('../../constants/connection-status');
const State = require('../../State');
const Topics = require('../../constants/topics');


const VideoBoxRemoteButtonNext = React.createClass({

  getInitialState: function() {
    return {
      state: State.getState()
    };
  },

  _handleClick: function() {
    State.emit(Topics.REQUEST_NEW_PARTNER);
  },

  _handleStateChange: function() {
    this.setState({
      state: State.getState()
    });
  },

  componentDidMount: function() {
    State.onStateChange(this._handleStateChange);
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
