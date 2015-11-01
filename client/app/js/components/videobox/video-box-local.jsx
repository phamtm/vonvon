const React = require('react');
const connectionManager = require('../../connection-manager');


const VideoBoxLocal = React.createClass({

  getInitialState: function() {
    return {
      localStream: connectionManager.getLocalStream()
    };
  },

  _onStreamChange: function() {
    this.setState({
      localStream: connectionManager.getLocalStream()
    });
  },

  componentDidMount: function() {
    connectionManager.onStreamLocalReceived(this._onStreamChange);
  },

  render: function() {
    const localStream = this.state.localStream;
    var localStreamSrc = null;
    if (localStream !== null) {
      localStreamSrc = window.URL.createObjectURL(localStream);
    }

    return (
      <div className={"local-video-holder"}>
        <video className={"responsive-video localVideo"} autoPlay muted="muted"
               src={localStreamSrc} >
        </video>
      </div>
    );
  }

});

module.exports = VideoBoxLocal;
