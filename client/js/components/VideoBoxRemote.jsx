var React = require('react');

var Spinner = require('./Spinner.jsx');
var ButtonAction = require('../actions/ButtonAction.js');
var ConnectionStatusStore = require('../stores/ConnectionStatusStore');
var StreamStore = require('../stores/StreamStore');
var ConstConnectionStatus = require('../constants/ConstConnectionStatus');


var VideoBoxRemote = React.createClass({
  options: {
    'backgroundColor': '#2c3e50',
    'color': 'white'
  },

  getInitialState: function() {
    return {
      connectionStatus: ConnectionStatusStore.getStatus(),
      remoteStream: StreamStore.getRemoteStream()
    }
  },

  componentDidMount: function() {
    ConnectionStatusStore.addChangeListener(this._onConnectionStatusChange);
    StreamStore.addChangeListener(this._onRemoteStreamChange);
  },

  _onConnectionStatusChange: function() {
    this.setState({
      connectionStatus: ConnectionStatusStore.getStatus()
    });
  },

  _onRemoteStreamChange: function() {
    this.setState({
      remoteStream: StreamStore.getRemoteStream()
    });
  },

  getVideoHolder: function() {
    switch (this.state.connectionStatus) {
      case ConstConnectionStatus.NONE:
        return <span>NO VIDEO</span>;

      case ConstConnectionStatus.REQUESTING:
        return <Spinner />;

      case ConstConnectionStatus.CONNECTED:
        var remoteStream = this.state.remoteStream;
        var remoteStreamSrc = window.URL.createObjectURL(remoteStream);
        return <video autoPlay src={remoteStreamSrc}></video>;

      default:
        break;
    }
  },

  render: function() {
    return (
      <div className={"card"}>
        <div className={"card-image waves-effect waves-block waves-light"} style={this.options}>
          {this.getVideoHolder()}
        </div>
        <div className={"card-content"}>
          <VideoBoxRemoteTray connectionStatus={this.state.connectionStatus}/>
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
        <VideoBoxRemoteButtonStatus connectionStatus={this.props.connectionStatus}/>
      </div>
    );
  }
});

var VideoBoxRemoteButtonNext = React.createClass({
  getInitialState: function() {
    return {
      status: ConnectionStatusStore.getStatus()
    };
  },

  handleClick: function() {
    ButtonAction.next();
    this._onStatusChange();
  },

  _onStatusChange: function() {
    this.setState({
      status: ConnectionStatusStore.getStatus()
    });
  },

  componentDidMount: function() {
    ConnectionStatusStore.addChangeListener(this._onStatusChange);
  },

  render: function() {
    var label = (this.state.status === ConstConnectionStatus.REQUESTING) ? 'Requesting new partner..' : 'Next';
    var disabled = (this.state.status === ConstConnectionStatus.REQUESTING) ? true : false;
    return (
      <button className={"waves-effect waves-light btn"} disabled={disabled} type="button" onClick={this.handleClick}>
        {label}
      </button>
    );
  }
});

var VideoBoxRemoteButtonStatus = React.createClass({
  render: function() {
    return (
      <button className={"waves-effect waves-light btn"} type="button">
        Status: {this.props.connectionStatus}
      </button>
    );
  }
});

module.exports = VideoBoxRemote;
