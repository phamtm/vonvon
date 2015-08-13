var React = require('react');

var State = require('../State');
var Spinner = require('./Spinner.jsx');
var ConnectionStatus = require('../constants/ConstConnectionStatus');
var Topics = require('../constants/Topics');


var VideoBoxRemote = React.createClass({
  options: {
    'backgroundColor': '#2c3e50',
    'color': 'white'
  },

  getInitialState: function() {
    return {
      connectionState: State.getState(),
      remoteStream: State.getRemoteStream()
    }
  },

  _handleRemoteStreamChange: function() {
    this.setState({
      remoteStream: State.getRemoteStream()
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
      case ConnectionStatus.NOT_CONNECTED:
        return <span>NO VIDEO</span>;

      case ConnectionStatus.REQUESTING:
        return <Spinner />;

      case ConnectionStatus.MATCHED:
        var remoteStream = this.state.remoteStream;
        var remoteStreamSrc = window.URL.createObjectURL(remoteStream);
        return <video autoPlay src={remoteStreamSrc}></video>;

      default:
        console.log(this.state.connectionState);
        return <span>DEFAULT</span>;
        break;
    }
  },

  render: function() {
    return (
      <div className={"card"}>
        <div className={"card-image waves-effect waves-block waves-light"} style={this.options}>
          {this._getVideoHolder()}
        </div>
        <div className={"card-content"}>
          <VideoBoxRemoteTray connectionState={this.state.connectionState}/>
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
        <VideoBoxRemoteButtonStatus connectionState={this.props.connectionState}/>
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
    var label = (this.state.state === ConnectionStatus.REQUESTING) ? 'Requesting new partner..' : 'Next';
    var disabled = (this.state.state === ConnectionStatus.REQUESTING) ? true : false;
    return (
      <button className={"waves-effect waves-light btn"} disabled={disabled} type="button" onClick={this._handleClick}>
        {label}
      </button>
    );
  }
});

var VideoBoxRemoteButtonStatus = React.createClass({
  render: function() {
    return (
      <button className={"waves-effect waves-light btn"} type="button">
        {this.props.connectionState}
      </button>
    );
  }
});

module.exports = VideoBoxRemote;
