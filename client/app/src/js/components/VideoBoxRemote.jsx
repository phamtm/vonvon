var React = require('react');
var Spinner = require('react-spinkit');

var State = require('../State');
var ConnectionStatus = require('../constants/ConnectionStatus');
var Topics = require('../constants/Topics');


const DARK_BACKGROUND = '#2c3e50';
const LIGHT_BACKGROUND = '#ffffff';

var VideoBoxRemote = React.createClass({

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
          <div className={'remote-video-holder'}>
            <img className="chat-video" data-src="holder.js/300x200?auto=yes&theme=vine" alt="Remote" />
          </div>
        );
    }
  },

  render: function() {
    return (
      <div className={"remote-video-holder"}>

        <div className={"card"}>
          <div className={"card-image"}>
            {this._getVideoHolder()}
            <span className={"card-title"}>{this.state.connectionState}</span>
          </div>

          <div className={"card-action"}>
            <VideoBoxRemoteButtonNext />
            <span className={"switch"}>
              <label>
                No video
                <input type="checkbox" defaultChecked />
                <span className={"lever"}></span>
                Video
              </label>
            </span>
          </div>

        </div>

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
    var label = (this.state.state === ConnectionStatus.REQUESTING) ? 'Requesting..' : 'Next';
    var disabled = this.state.state === ConnectionStatus.REQUESTING;
    return (
      <a href="#" disabled={disabled} onClick={this._handleClick}>
        {label}
      </a>
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
