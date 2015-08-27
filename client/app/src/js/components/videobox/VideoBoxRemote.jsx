var React = require('react');

var State = require('../../State');
var Spinner = require('./../Spinner.jsx');
var ConnectionStatus = require('../../constants/ConnectionStatus');
var Topics = require('../../constants/Topics');
var VideoBoxRemoteStatus = require('./VideoBoxRemoteStatus.jsx');
var VideoBoxRemoteTray = require('./VideoBoxRemoteTray.jsx');


const DARK_BACKGROUND = '#2c3e50';
const LIGHT_BACKGROUND = '#ffffff';

class VideoBoxRemote extends React.Component {

  constructor() {
    super()
  }

  getInitialState() {
    return {
      connectionState: State.getState(),
      remoteStream: State.getRemoteStream(),
      options: {
        'backgroundColor': '#2c3e50',
        'color': DARK_BACKGROUND
      }
    };
  }

  _handleRemoteStreamChange() {
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
  }

  _handleStateChange() {
    this.setState({
      connectionState: State.getState()
    });
  }

  componentDidMount() {
    State.onStateChange(this._handleStateChange);
    State.onStreamRemoteReceived(this._handleRemoteStreamChange);
  }

  _getVideoHolder() {
    switch (this.state.connectionState) {
      case ConnectionStatus.REQUESTING:
        return <Spinner />;

      case ConnectionStatus.MATCHED:
        var remoteStream = this.state.remoteStream;
        var remoteStreamSrc = null;
        if (remoteStream !== null) {
          remoteStreamSrc = window.URL.createObjectURL(remoteStream);
        }
        return <video autoPlay src={remoteStreamSrc}></video>;

      default:
        console.log(this.state.connectionState);
        return <div className='remote-video-holder'></div>;
        break;
    }
  }

  // componentWillReceiveProps: function(nextProps) {
  //   this.setState({
  //     likesIncreasing: nextProps.likeCount > this.props.likeCount
  //   });
  // },

  render() {
    return (
      <div className={"card"}>
        <div
          className={"card-image waves-effect waves-block waves-light"}
          style={this.state.options}>
          <VideoBoxRemoteStatus connectionState={this.state.connectionState}/>
          {this._getVideoHolder()}
        </div>
        <div className={"card-content"}>
          <VideoBoxRemoteTray connectionState={this.state.connectionState}/>
        </div>
      </div>
    );
  }
}



module.exports = VideoBoxRemote;
