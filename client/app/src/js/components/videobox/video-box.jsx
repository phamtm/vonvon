const React = require('react');
const VideoBoxLocal = require('./video-box-local.jsx');
const VideoBoxRemote = require('./video-box-remote.jsx');

const VideoBox = React.createClass({
  render: function() {
    return (
      <div className="left">
        <VideoBoxRemote />
        <VideoBoxLocal />
      </div>
    );
  }
});

module.exports = VideoBox;
