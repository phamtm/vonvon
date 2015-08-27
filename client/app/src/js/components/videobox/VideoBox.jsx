var React = require('react');
var VideoBoxLocal = require('./VideoBoxLocal.jsx');
var VideoBoxRemote = require('./VideoBoxRemote.jsx');

class VideoBox extends React.Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <VideoBoxRemote />
        <VideoBoxLocal />
      </div>
    );
  }
}

module.exports = VideoBox;
