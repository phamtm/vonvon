const React = require('react');
const connectionManager = require('../../connection-manager');
const ConnectionStatus = require('../../constants/connection-status');
const Topics = require('../../constants/topics');
const ButtonNext = require('./button-next.jsx');
const ButtonWebcam = require('./button-webcam.jsx');
const ButtonNextInitial = require('./button-next-initial.jsx');

const VideoBoxRemote = React.createClass({

  getInitialState: function() {
    return {
      connectionState: connectionManager.getState(),
      remoteStream: connectionManager.getRemoteStream(),
    };
  },

  _handleRemoteStreamChange: function() {
    this.setState({
      remoteStream: connectionManager.getRemoteStream(),
    });
  },

  _handleStateChange: function() {
    this.setState({
      connectionState: connectionManager.getState()
    });
  },

  componentDidMount: function() {
    connectionManager.onStateChange(this._handleStateChange);
    connectionManager.onStreamRemoteReceived(this._handleRemoteStreamChange);
  },

  render: function() {
    switch (this.state.connectionState) {
      case ConnectionStatus.REQUESTING:
        return (
          <div className={"remote-video-holder"}>
            <div className={"loader"}>
              Loading…
            </div>
            <button className="btn-justified-large button-next" disabled >
              Requesting..
            </button>
          </div>
        );

      case ConnectionStatus.MATCHED:
        var remoteStream = this.state.remoteStream;
        var remoteStreamSrc = null;
        if (remoteStream !== null) {
          console.log('VideoBoxRemote::video received');
          remoteStreamSrc = window.URL.createObjectURL(remoteStream);
        }
        return (
          <div className={"remote-video-holder"}>
            <video autoPlay className={"responsive-video remoteVideo"}
                   src={remoteStreamSrc} />
            <ButtonNext />
            <ButtonWebcam />
          </div>
        );

      default:
        return (
          <div className={"remote-video-holder"}>
            <div className="remote-video-placeholder">
              <span>
                VonVon is a place where you can have video chat with random folks on the internet.
                Be vigilant, enjoy and have fun!
              </span>
              <ButtonNextInitial />
            </div>
          </div>
        );
    }
  }
});

module.exports = VideoBoxRemote;
