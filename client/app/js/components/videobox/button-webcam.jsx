const React = require('react');


const ButtonWebcam = React.createClass({

  _handleClick: function() {
    console.log('webcam button clicked');
  },

  render: function() {
    return (
      <button className="btn-justified-large button-webcam"
              onClick={this._handleClick} >
        <i className="tiny material-icons webcam-button-icon">videocam_off</i>
      </button>
    );
  }
});

module.exports = ButtonWebcam;



