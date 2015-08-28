var React = require('react');

var StateInstance = require('../State');
var VideoBox = require('./VideoBox.jsx');
var ChatBox = require('./chatbox/ChatBox.jsx');
var Topics = require('../constants/Topics');


var App = React.createClass({

  componentDidMount: function() {
    StateInstance.init();
  },

  render: function() {
    return (
      <div className="wrapper-all" id="appComponent">

        <div className="navbar">
          <ul>
            <li className="logo">VonVon.vn</li>
            <li>have fun!</li>
          </ul>
        </div>

        <div className="wrapper-content">
          <VideoBox />
          <ChatBox />
        </div>

      </div>
    );
  }
});

module.exports = App;
