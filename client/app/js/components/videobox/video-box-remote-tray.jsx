const React = require('react');
const VideoBoxRemoteButtonNext = require('./video-box-remote-button-next.jsx');


const VideoBoxRemoteTray = React.createClass({

  render: function() {
    return (
      <div>
        <VideoBoxRemoteButtonNext />
      </div>
    );
  }

});

module.exports = VideoBoxRemoteTray;
