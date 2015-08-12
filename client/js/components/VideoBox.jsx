var React = require('react');
var VideoBoxLocal = require('./VideoBoxLocal.jsx');
var VideoBoxRemote = require('./VideoBoxRemote.jsx');

var VideoBox = React.createClass({
  render: function() {
    return (
      <div>
        <VideoBoxRemote />
        <VideoBoxLocal />
      </div>
    );
  }
});

module.exports = VideoBox;
