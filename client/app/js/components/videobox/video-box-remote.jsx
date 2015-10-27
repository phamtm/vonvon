const React = require('react');
const Spinner = require('react-spinkit');
const connectionManager = require('../../connection-manager');
const ConnectionStatus = require('../../constants/connection-status');
const Topics = require('../../constants/topics');
const VideoBoxRemoteButtonNext = require('./video-box-remote-button-next.jsx');


const DARK_BACKGROUND = '#2c3e50';
const LIGHT_BACKGROUND = '#ffffff';

const VideoBoxRemote = React.createClass({

  getInitialState: function() {
    return {
      connectionState: connectionManager.getState(),
      remoteStream: connectionManager.getRemoteStream(),
      options: {
        'backgroundColor': '#2c3e50',
        'color': DARK_BACKGROUND
      }
    };
  },

  _handleRemoteStreamChange: function() {
    var backgroundColor = DARK_BACKGROUND;

    if (connectionManager.getState() === ConnectionStatus.MATCHED) {
      backgroundColor = LIGHT_BACKGROUND;
    }

    this.setState({
      remoteStream: connectionManager.getRemoteStream(),
      options: {
        'backgroundColor': '#2c3e50',
        'color': backgroundColor
      }
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
        <button className="btn-justified-large"
                style={{position: 'absolute', left: '30px', bottom:'30px'}}>
          Next
        </button>
        <button className="btn-justified-large"
                style={{position: 'absolute', left: '200px', bottom:'30px', background: '#B53F47'}}>
          Stop chatting
        </button>
        {this._getVideoHolder()}
      </div>
    );
  }
});

module.exports = VideoBoxRemote;
