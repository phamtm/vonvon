var Config = require('./config.js');
var ConnectionStatus = require('./constants/ConnectionStatus');
var EventEmitter = require("events").EventEmitter;
var io = require('socket.io-client');
var Peer = require('peerjs');
var Topics = require('./constants/Topics');
var Message = require('./utils/MessageUtil');


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
  this._peerId = null;
  this._socket = io.connect(
  	Config.WEB_SERVER,
  	{'sync disconnect on unload': true}
  );
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
    var authoredMessage = Message.convertRawMessage(message, true);
    this._messages.push(authoredMessage);
    this.emit(Topics.MESSAGE_CHANGED);
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
    console.log
    );
};

State.prototype._closeConn = function() {
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
  	this._socket.emit('request-new-partner');
  }
};

State.prototype._cleanUpAndRequestNewPartner = function(peerId) {
  if (this._peerId !== null && peerId !== this._peerId) {
     return;
  }
  this._messages = [];
  this.emit(Topics.MESSAGE_CHANGED);
  this._closeConn();
  this._clearMessages();
  this._requestNewPartner();
};

State.prototype._setUpChat = function() {
  this._peerDataConn.on('data', function(data) {
    var rawMessage = Message.convertRawMessage(data, false);
    this._messages.push(rawMessage);
    this.emit(Topics.MESSAGE_CHANGED);
  }.bind(this));

  this._peerDataConn.on('close', function() {
    this._cleanUpAndRequestNewPartner(this._peerId);
  }.bind(this));
};

State.prototype.init = function() {
  var _self = this;

  // setInterval(function() {
  //   var videoTrack = this._localStream.getVideoTracks()[0];
  //   if (videoTrack.readyState !== 'live') {
  //     this._getLocalMedia();
  //     this.emit(Topics.STREAM_LOCAL_CHANGED);
  //   }

  //   if (this._state === ConnectionStatus.MATCHED) {
  //     if (!this._peerCallConn.open || !this._peerDataConn.open) {
  //       console.log("YAHOOOOOOOOOOOOOOOO");
  //       this._cleanUpAndRequestNewPartner();
  //     }
  //   }
  // }.bind(this), 10000);

  this._getLocalMedia();

  this.onRequestNextPartner(function() {
    this._cleanUpAndRequestNewPartner(this._peerId);
  }.bind(this));

  this._socket.on('connection-created', function(data) {
    var LOCAL_ID = data.id;
    var PARTNER_ID;

    // Create a new connection to the PeerJs-server
    console.log('Connection created, id::' + LOCAL_ID);
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

    // Received chat data
    _self._peerConn.on('connection', function(dataConnection) {
      _self._peerDataConn = dataConnection;
      _self._setUpChat(dataConnection);
    });

    // When received a new partner id
    _self._socket.on('matched', function (data) {
      // Matched with a partner
      if (!data || !data.hasOwnProperty('partnerId')) {
        return;
      }
      console.log('Partner matched, partner-id::' + data.partnerId);
      PARTNER_ID = data.partnerId;
      _self._peerId = PARTNER_ID;
      _self._state = ConnectionStatus.MATCHED;
      _self.emit(Topics.STATE_CHANGED, ConnectionStatus.MATCHED);

      if (LOCAL_ID.localeCompare(PARTNER_ID) < 0) {
        console.log("Calling peer::" + PARTNER_ID);
        _self._peerDataConn = _self._peerConn.connect(PARTNER_ID);
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

module.exports = STATE_INSTANCE;
