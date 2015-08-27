var React = require('react');

var Topics = require('../../constants/Topics');
var ConnectionStatus = require('../../constants/ConnectionStatus');


class VideoBoxRemoteButtonNext extends React.Component {

  constructor() {
    super()
  }

  getInitialState() {
    return {
      state: State.getState()
    };
  }

  _handleClick() {
    State.emit(Topics.REQUEST_NEW_PARTNER);
  }

  _handleStateChange() {
    this.setState({
      state: State.getState()
    });
  }

  componentDidMount() {
    State.onStateChange(this._handleStateChange);
  }

  render() {
    var label = (this.state.state === ConnectionStatus.REQUESTING) ? 'Requesting new partner..' : 'Next';
    var disabled = (this.state.state === ConnectionStatus.REQUESTING) ? true : false;
    return (
      <button className={"waves-effect waves-light btn"}
              disabled={disabled}
              type="button"
              onClick={this._handleClick}>
        {label}
      </button>
    );
  }
}

module.exports = VideoBoxRemoteButtonNext;
