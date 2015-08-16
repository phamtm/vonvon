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
      <div>
        <div className={"col s12 m6 l4"}>
          <VideoBox />
        </div>

        <div className={"col s12 m6 l8"}>
          <ChatBox />
        </div>
      </div>
    );
  }
});

module.exports = App;
