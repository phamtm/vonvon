const React = require('react');
const StateInstance = require('../State');
const VideoBox = require('./videobox/video-box.jsx');
const ChatBox = require('./chatbox/chat-box.jsx');
const Topics = require('../constants/topics');


const App = React.createClass({

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
