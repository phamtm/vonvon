const React = require('react');
const connectionManager = require('../../connection-manager');
const log = require('../../utils/log');


const ButtonWebcam = React.createClass({

  _handleClick: function() {
    connectionManager.notifyWebcamToggled();
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



