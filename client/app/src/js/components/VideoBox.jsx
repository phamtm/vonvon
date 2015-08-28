var React = require('react');
var VideoBoxLocal = require('./VideoBoxLocal.jsx');
var VideoBoxRemote = require('./VideoBoxRemote.jsx');

var VideoBox = React.createClass({
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
