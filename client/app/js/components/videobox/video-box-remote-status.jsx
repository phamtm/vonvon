const React = require('react');


const VideoBoxRemoteStatus = React.createClass({

  render: function() {
    return (
      <span className="card-title">{this.props.connectionState}</span>
    );
  }

});

module.exports = VideoBoxRemoteStatus;
