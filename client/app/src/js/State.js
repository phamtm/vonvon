var Config = require('./config.js');
var ConnectionStatus = require('./constants/ConnectionStatus');
var EventEmitter = require('events').EventEmitter;
var io = require('socket.io-client');
var Peer = require('peerjs_fork_firefox40');
var Topics = require('./constants/Topics');
var MessageUtil = require('./utils/MessageUtil');


/**
 * Constructor
 */
 var State = function() {
  EventEmitter.call(this);

  // Connection status
  this._state = ConnectionStatus.NOT_CONNECTED;

  // Chat messages
  this._messages = [];

  // Connections: server and peer
  this._localId = null;
  this._peerId = null;
  this._socket = null;
  this._peerConn = null;
  this._peerCallConn = null;
  this._peerDataConn = null;

  // Video streams
  this._localStream = null;
  this._remoteStream = null;
};

State.prototype = Object.create(EventEmitter.prototype);

// Getters
State.prototype.getState = function() {
  return this._state;
};

State.prototype.getMessages = function() {
  return this._messages;
};

State.prototype.getLocalStream = function() {
  return this._localStream;
};

State.prototype.getRemoteStream = function() {
  return this._remoteStream;
};

// State events
State.prototype.onStateChange = function(cb) {
  this.addListener(Topics.STATE_CHANGED, cb);
};

// Chat events
State.prototype.onMessageReceived = function(cb) {
  this.addListener(Topics.MESSAGE_RECEIVED, cb);
};

State.prototype.onMessageSend = function(cb) {
  this.addListener(Topics.MESSAGE_SEND, cb);
};

State.prototype.onMessageChange = function(cb) {
  this.addListener(Topics.MESSAGE_CHANGED, cb);
};

State.prototype.onChatChannelOpened = function(cb) {
  this.addListener(Topics.CHAT_CHANNEL_OPENED, cb);
};

State.prototype.onChatChannelClosed = function(cb) {
  this.addListener(Topics.CHAT_CHANNEL_CLOSED, cb);
};

// Stream events
State.prototype.onStreamLocalReceived = function(cb) {
  this.addListener(Topics.STREAM_LOCAL_RECEIVED, cb);
};

State.prototype.onStreamRemoteReceived = function(cb) {
  this.addListener(Topics.STREAM_REMOTE_RECEIVED, cb);
};

// Next event
State.prototype.onRequestNextPartner = function(cb) {
  this.addListener(Topics.REQUEST_NEW_PARTNER, cb);
};

State.prototype.sendChat = function(message) {
  if (message &&
      this._peerDataConn &&
      this._peerDataConn.open &&
      this._state == ConnectionStatus.MATCHED) {
    this._peerDataConn.send(message);
    var authoredMessage = Message.convertRawMessage(message, this._localId + ' (You)');
    this._messages.push(authoredMessage);
    this.emit(Topics.MESSAGE_CHANGED);
  }
};

State.prototype.sendMessage = function(transferableMessage) {
  // TODO: check if data channel is closed
  if (this._peerDataConn &&
      this._peerDataConn.open &&
      this._state == ConnectionStatus.MATCHED &&
      transferableMessage) {
    var serializedMessage = JSON.stringify(transferableMessage);
    this._peerDataConn.send(serializedMessage);
    var presentableMessage = MessageUtil.convertToPresentableMessage(
        transferableMessage, this._localId, true);
    presentableMessage.authorName = 'You';
    this._messages.push(presentableMessage);
    this.emit(Topics.MESSAGE_CHANGED);
  }
};


State.prototype.sendTextMessage = function(text) {
  if (text) {
    var transferableMessage = MessageUtil.convertToTransferableTextMessage(text);
    this.sendMessage(transferableMessage);
  }
};

State.prototype.sendStickerMessage = function(stickerCode) {
  if (stickerCode) {
    var transferableMessage = MessageUtil.convertToTransferableStickerMessage(stickerCode);
    this.sendMessage(transferableMessage);
  }
};

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

State.prototype._getLocalMedia = function() {
  // Capture local media
  navigator.getUserMedia(
    Config.WEBRTC_MEDIA_CONSTRAINTS,
    function(localStream) {
      this._localStream = localStream;
      this.emit(Topics.STREAM_LOCAL_RECEIVED);
    }.bind(this),
    function() {
      window.location.replace('not-supported.html');
      console.log('__localstream:: null');
    }
  );
};

State.prototype._closeConn = function() {
  // if (!this._peerConn || this._peerConn.disconnected || this._peerConn.destroyed) {
  //   return;
  // }
  if (!this._peerConn) {
    return;
  }

  if (this._peerCallConn && this._peerCallConn.open) {
    this._peerCallConn.close();
  }

  if (this._peerDataConn && this._peerDataConn.open) {
    this._peerDataConn.close();
  }
};

State.prototype._clearMessages = function() {
  this._messages = [];
  this.emit(Topics.MESSAGE_CHANGED);
};

State.prototype._requestNewPartner = function() {
  if (this._state !== ConnectionStatus.REQUESTING) {
    console.log('Requesting new partner..');
    this._state = ConnectionStatus.REQUESTING;
    this.emit(Topics.STATE_CHANGED);
    this._socket.emit('socket-io::request-new-partner');
  }
};

State.prototype._cleanUpAndRequestNewPartner = function(peerId) {
  if (this._peerId !== null && peerId !== this._peerId) {
     return;
  }
  this._clearMessages();
  this._closeConn();
  this._requestNewPartner();
};

State.prototype._setUpChat = function() {
  this._peerDataConn.on('data', function(data) {
    if (this._state !== ConnectionStatus.MATCHED) {
      return;
    }

    var deserializedMessage = JSON.parse(data);
    var presentableMessage = MessageUtil.convertToPresentableMessage(
       deserializedMessage, this._peerId, false);
    this._messages.push(presentableMessage);
    this.emit(Topics.MESSAGE_CHANGED);
  }.bind(this));

  this._peerDataConn.on('close', function() {
    this.emit(Topics.CHAT_CHANNEL_CLOSED);
    // potential bug: what if media connection also close at this time?
    this._cleanUpAndRequestNewPartner(this._peerId);
  }.bind(this));
};

State.prototype.init = function() {
  var _self = this;

  this._getLocalMedia();

  this._socket = io.connect(
    Config.WEB_SERVER,
    {'sync disconnect on unload': true}
  );

  // setInterval(function() {
  //   // Re-retrieved local stream
  //   if (this._localStream && this._localStream.getVideoTracks() &&
  //       this._localStream.getVideoTracks().length) {
  //     var videoTrack = this._localStream.getVideoTracks()[0];
  //     if (videoTrack.readyState !== 'live') {
  //       this._getLocalMedia();
  //       this.emit(Topics.STREAM_LOCAL_CHANGED);
  //     }
  //   }

  //   // Re-establshied the connection to socket-io server
  //   this._socket = io.connect(
  //     Config.WEB_SERVER,
  //     {'sync disconnect on unload': true}
  //   );

  // //   if (this._state === ConnectionStatus.MATCHED) {
  // //     if (!this._peerCallConn.open || !this._peerDataConn.open) {
  // //       console.log("YAHOOOOOOOOOOOOOOOO");
  // //       this._cleanUpAndRequestNewPartner();
  // //     }
  // //   }
  //   }.bind(this), 3000
  // );

  this.onRequestNextPartner(function() {
    console.log('Next request');
    this._cleanUpAndRequestNewPartner(this._peerId);
  }.bind(this));

  this._socket.on('socket-io::connection-created', function(data) {
    _self._localId = data.id;
    _self.emit(Topics.ID_LOCAL_CHANGED);
    var PARTNER_ID;

    // Create a new connection to the PeerJs-server
    console.log('Connection created, id::' + _self._localId);
    _self._peerConn = new Peer(data.id, Config.PEER_SERVER_OPTIONS);

    // Received a call
    _self._peerConn.on('call', function(remoteCall) {
      _self._peerCallConn = remoteCall;

      remoteCall.on('close', function() {
        _self._cleanUpAndRequestNewPartner();
      });

      console.log("Receiving a call..")
      remoteCall.answer(_self._localStream); // Answer the call with an A/V stream.
      remoteCall.on('stream', function(remoteStream) {
        _self._remoteStream = remoteStream;
        _self.emit(Topics.STREAM_REMOTE_RECEIVED);
      });
    });

    _self._peerConn.on('disconnected', function() {
      console.log('PeerConn:disconnected');
    });

    // Received chat data
    _self._peerConn.on('connection', function(dataConnection) {
      _self.emit(Topics.CHAT_CHANNEL_OPENED);
      _self._peerDataConn = dataConnection;
      _self._setUpChat(dataConnection);
    });

    // When received a new partner id
    _self._socket.on('socket-io::matched', function (data) {
      // Matched with a partner
      if (!data || !data.hasOwnProperty('partnerId')) {
        return;
      }
      console.log('Partner matched, partner-id::' + data.partnerId);
      PARTNER_ID = data.partnerId;
      _self._peerId = PARTNER_ID;
      _self.emit(Topics.ID_PARTNER_CHANGED);
      _self._state = ConnectionStatus.MATCHED;
      _self.emit(Topics.STATE_CHANGED, ConnectionStatus.MATCHED);

      if (_self._localId.localeCompare(PARTNER_ID) < 0) {
        console.log("Calling peer::" + PARTNER_ID);
        _self._peerDataConn = _self._peerConn.connect(PARTNER_ID);
        _self.emit(Topics.CHAT_CHANNEL_OPENED);
        _self._setUpChat(_self._peerDataConn);

        // If the user disable localStream, or no device -> do not call media
        _self._peerCallConn = _self._peerConn.call(PARTNER_ID, _self._localStream);

        if (_self._peerCallConn) {
          _self._peerCallConn.on('close', function() {
            console.log('ending your call');
            _self._cleanUpAndRequestNewPartner(PARTNER_ID);
          });

          // user with lower id call user with higher id
          _self._peerCallConn.on('stream', function(remoteStream) {
            _self._remoteStream = remoteStream;
            _self.emit(Topics.STREAM_REMOTE_RECEIVED);
          });
        }
      }
    });
  });
};

var STATE_INSTANCE = new State();
window.state = STATE_INSTANCE;

module.exports = STATE_INSTANCE;
