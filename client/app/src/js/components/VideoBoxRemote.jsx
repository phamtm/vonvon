const React = require('react');
const Spinner = require('react-spinkit');

// const FlatButton = require('material-ui/lib/flat-button');
// const Avatar = require('material-ui/lib/avatar');
// const CardUi = require('material-ui/lib/card/index');

const State = require('../State');
const ConnectionStatus = require('../constants/ConnectionStatus');
const Topics = require('../constants/Topics');


const DARK_BACKGROUND = '#2c3e50';
const LIGHT_BACKGROUND = '#ffffff';

const VideoBoxRemote = React.createClass({

  getInitialState: function() {
    return {
      connectionState: State.getState(),
      remoteStream: State.getRemoteStream(),
      options: {
        'backgroundColor': '#2c3e50',
        'color': DARK_BACKGROUND
      }
    };
  },

  _handleRemoteStreamChange: function() {
    var state = State.getState();
    var backgroundColor = DARK_BACKGROUND;
    if (state === ConnectionStatus.MATCHED) {
      backgroundColor = LIGHT_BACKGROUND;
    }
    this.setState({
      remoteStream: State.getRemoteStream(),
      options: {
        'backgroundColor': '#2c3e50',
        'color': backgroundColor
      }
    });
  },

  _handleStateChange: function() {
    this.setState({
      connectionState: State.getState()
    });
  },

  componentDidMount: function() {
    State.onStateChange(this._handleStateChange);
    State.onStreamRemoteReceived(this._handleRemoteStreamChange);
  },

  _getVideoHolder: function() {
    switch (this.state.connectionState) {
      case ConnectionStatus.REQUESTING:
        return <Spinner spinnerName="circle" noFadeIn/>;

      case ConnectionStatus.MATCHED:
        var remoteStream = this.state.remoteStream;
        var remoteStreamSrc = null;
        if (remoteStream !== null) {
          remoteStreamSrc = window.URL.createObjectURL(remoteStream);
        }

        console.log('video received');
        return (
          <video autoPlay className={"responsive-video remoteVideo"}
                 src={remoteStreamSrc} />
        );

      default:
        console.log(this.state.connectionState);
        return (
          <div className="remote-video-placeholder">
            <span>
              VonVon is a place where you can have video chat with random folks on the internet.
              Be vigilant, enjoy and have fun!
            </span>
            <VideoBoxRemoteButtonNext />
          </div>
        );
    }
  },

  render: function() {
    return (
      <div className={"remote-video-holder"}>
        {this._getVideoHolder()}
      </div>
    );
  }
});

var VideoBoxRemoteTray = React.createClass({
  render: function() {
    return (
      <div>
        <VideoBoxRemoteButtonNext />
      </div>
    );
  }
});

var VideoBoxRemoteButtonNext = React.createClass({

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

var VideoBoxRemoteStatus = React.createClass({
  render: function() {
    return (
      <span className="card-title">{this.props.connectionState}</span>
    );
  }
});

module.exports = VideoBoxRemote;
