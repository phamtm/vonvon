const React = require('react');
const VideoBoxLocal = require('./VideoBoxLocal.jsx');
const VideoBoxRemote = require('./VideoBoxRemote.jsx');

const VideoBox = React.createClass({
  render: function() {
    return (
      <div className="left">
        <div className="videos-holder">
          <VideoBoxRemote />
          <VideoBoxLocal />
        </div>
      </div>
    );
  }
});

module.exports = VideoBox;
