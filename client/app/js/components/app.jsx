const React = require('react');
const connectionManager = require('../connection-manager');
const VideoBox = require('./videobox/video-box.jsx');
const ChatBox = require('./chatbox/chat-box.jsx');
const Topics = require('../constants/topics');


const App = React.createClass({

  componentDidMount: function() {
  },

  render: function() {
    return (
      <div className="wrapper-all" id="appComponent">

        <div className="wrapper-content">
          <VideoBox />
          <ChatBox />
        </div>

      </div>
    );
  }
});

module.exports = App;