var React = require('react');
var State = require('../../State');


class VideoBoxLocal extends React.Component {

  constructor() {
    super();

    this.localStream = State.getLocalStream();

    this._onStreamChange = this._onStreamChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
  }

  _onStreamChange() {
    this.setState({
      localStream: State.getLocalStream()
    });
  }

  componentDidMount() {
    State.onStreamLocalReceived(this._onStreamChange);
  }

  render() {
    var localStream = this.state.localStream;
    var localStreamSrc = null;
    if (localStream !== null) {
      localStreamSrc = window.URL.createObjectURL(localStream);
    }
    return (
      <div className={"card hide-on-small-only"}>
        <div className={"card-image waves-effect waves-block waves-light"}>
          <video autoPlay muted="muted" src={localStreamSrc}></video>
        </div>
      </div>
    );
  }
}

module.exports = VideoBoxLocal;
