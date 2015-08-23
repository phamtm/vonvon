var React = require('react');


class VideoBoxRemoteStatus extends React.Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div className="connection-status">
        {this.props.connectionState}
      </div>
    );
  }
}

module.exports = VideoBoxRemoteStatus;
