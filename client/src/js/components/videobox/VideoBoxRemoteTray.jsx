var React = require('react');

var VideoBoxRemoteButtonNext = require('./VideoBoxRemoteButtonNext.jsx');


class VideoBoxRemoteTray extends React.Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <VideoBoxRemoteButtonNext />
      </div>
    );
  }
}

module.exports = VideoBoxRemoteTray;
