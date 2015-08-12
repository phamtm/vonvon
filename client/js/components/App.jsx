var React = require('react');
var Peer = require('peerjs');
var io = require('socket.io-client');
var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var VideoBox = require('./VideoBox.jsx');
var ChatBox = require('./ChatBox.jsx');

var Config = require('../config');

var ConstConnectionStatus = require('../constants/ConstConnectionStatus');

var ChatMessageListStore = require('../stores/ChatMessageListStore');
var ConnectionStatusStore = require('../stores/ConnectionStatusStore');
var StreamStore = require('../stores/StreamStore');

var ButtonAction = require('../actions/ButtonAction');
var ChatBoxAction = require('../actions/ChatBoxAction');
var ConnectionStatusAction = require('../actions/ConnectionStatusAction');
var StreamAction = require('../actions/StreamAction');


navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

var App = React.createClass({
  _setUpChat: function (peerDataConnection) {
    console.log('in setup');
    ChatBoxAction.setPeerDataConnection(peerDataConnection);
    peerDataConnection.on('data', function (data) {
      ChatBoxAction.receivedChatMessage(data);
    });
  },

  componentDidMount: function() {
    var _self = this;
    navigator.getUserMedia(
      Config.WEBRTC_MEDIA_CONSTRAINTS,
      function(localStream) {
        StreamAction.setLocalStream(localStream);
      },
      function() {
        window.location.replace('not-supported.html');
      }
    );

    var socket = io.connect(Config.WEB_SERVER, {
      'sync disconnect on unload': true
    });
    ConnectionStatusAction.setSocketIoConnection(socket);

    // 2. Request for new partner id
    socket.on('connection-created', function (data) {
      const localId = data.id;
      var partnerId;
      var call;
      var isBound = false;

      // 1. Create a new connection to the PeerJs-server
      console.log('Connection created, id::' + localId);
      var peerConnection = new Peer(data.id, Config.PEER_SERVER_OPTIONS);


      // 2. When received a new partner id
      socket.on('matched', function (data) {
        // bogus partnerId
        if (_.isEmpty(data) || !_.has(data, 'partnerId')) {
          return;
        }
        ConnectionStatusAction.setConnectionStatus(ConstConnectionStatus.MATCHED);
        partnerId = data.partnerId;
        console.log('Partner matched, partner-id::' + data.partnerId);

        // user with lower id call user with higher id
        if (localId.localeCompare(partnerId) < 0) {
          console.log("Calling peer::" + data.partnerId);
          call = peerConnection.call(data.partnerId, StreamStore.getLocalStream());
          ConnectionStatusAction.setPeerCall(call);

          var peerDataConnection = peerConnection.connect(partnerId);
          peerDataConnection.on('open', function() {
            _self._setUpChat(peerDataConnection);
          });

          console.log('setup chat actively');
          // _self._setUpChat(peerDataConnection);

          call.on('close', function() {
            if (!AppDispatcher.isDispatching()) {
              ConnectionStatusAction.closeCallPassively();
            }
          });

          call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            console.log("Receiving remote stream");
            StreamAction.setRemoteStream(remoteStream);
            ConnectionStatusAction.setConnectionStatus(ConstConnectionStatus.CONNECTED);
          });
        }

        // Answer
        else {
          if (!isBound) {
            peerConnection.on('call', function(call) {
              isBound = true;
              ConnectionStatusAction.setConnectionStatus(ConstConnectionStatus.CONNECTED);
              ConnectionStatusAction.setPeerCall(call);

              call.on('close', function() {
                if (!AppDispatcher.isDispatching()) {
                  ConnectionStatusAction.closeCallPassively();
                }
              });

              console.log("Receiving a call passively..")
              call.answer(StreamStore.getLocalStream()); // Answer the call with an A/V stream.
              call.on('stream', function(remoteStream) {
                // Show stream in some video/canvas element.
                console.log("Receiving remote stream passively");
                StreamAction.setRemoteStream(remoteStream);
              });
            });

            peerConnection.on('connection', function(dataConnection) {
              console.log('setup chat passively');
              _self._setUpChat(dataConnection);
            });
          }

        }
      });
    });
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
