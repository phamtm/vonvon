var React = require('react');
var State = require('../State');


var VideoBoxLocal = React.createClass({

  getInitialState: function() {
    return {
      localStream: State.getLocalStream()
    };
  },

  _onStreamChange: function() {
    this.setState({
      localStream: State.getLocalStream()
    });
  },

  componentDidMount: function() {
    State.onStreamLocalReceived(this._onStreamChange);
  },

  render: function() {
    var localStream = this.state.localStream;
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
