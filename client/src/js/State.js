var Config = require('./config.js');
var ConnectionStatus = require('./constants/ConnectionStatus');
var EventEmitter = require("events").EventEmitter;
var io = require('socket.io-client');
var Topics = require('./constants/Topics');
var MessageUtil = require('./utils/MessageUtil');
var quickconnect = require('rtc-quickconnect');
var freeice = require('freeice');
var rtcCapture = require('rtc-capture');
var rtcAttach = require('rtc-attach');
var temasysPlugin = require('rtc-plugin-temasys');


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
  this._qc = null;

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

State.prototype.sendChat = function(text) {
  // TODO: check if data channel is closed
  if (text && this._dataChannel) {
    var transferableMessage = MessageUtil.convertToTransferableMessage(text);
    var serializedMessage = JSON.stringify(transferableMessage);
    this._dataChannel.send(serializedMessage);
    var presentableMessage = MessageUtil.convertToPresentableMessage(
        transferableMessage, this._localId);
    presentableMessage.authorName += ' (You)';
    this._messages.push(presentableMessage);
    this.emit(Topics.MESSAGE_CHANGED);
  }
};

State.prototype._getLocalMedia = function() {
  rtcCapture(
    Config.WEBRTC_MEDIA_CONSTRAINTS,
    {
      plugins: [temasysPlugin]
    },
    function(err, localStream) {
      if (err) {
        return console.error('could not capture media', err);
      }
      this._localStream = localStream;
      this.emit(Topics.STREAM_LOCAL_RECEIVED);
    }.bind(this)
  );
};

State.prototype._closeConn = function() {
  console.log(this._qc);
  if (this._qc) {
    this._qc.close();
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
  this._clearMessages();
  this._closeConn();
  this._requestNewPartner();
};

State.prototype._setUpChat = function() {
};

State.prototype.init = function() {
  var _self = this;
  this._socket = io.connect(
    Config.WEB_SERVER,
    {'sync disconnect on unload': true}
  );

  this._getLocalMedia();

  this.onRequestNextPartner(function() {
    console.log('Next request');
    if (this._state === ConnectionStatus.MATCHED) {
      this._cleanUpAndRequestNewPartner(this._peerId);
    }
  }.bind(this));

  this._socket.on('socket-io::connection-created', function(data) {
    _self._localId = data.id;
    var PARTNER_ID;

    // Create a new connection to the PeerJs-server
    console.log('Connection created, id::' + _self._localId);

    // When received a new partner id
    _self._socket.on('socket-io::matched', function (data) {
      // Matched with a partner
      if (!data || !data.hasOwnProperty('partnerId')) {
        return;
      }
      console.log('Partner matched, partner-id::' + data.partnerId);
      PARTNER_ID = data.partnerId;
      _self._peerId = PARTNER_ID;
      _self._state = ConnectionStatus.MATCHED;
      _self.emit(Topics.STATE_CHANGED, ConnectionStatus.MATCHED);

      var roomId = _self._localId + ' # ' + _self._peerId;

      if (_self._localId.localeCompare(PARTNER_ID) < 0) {
        roomId = _self._peerId + ' # ' + _self._localId;
      }

      console.log('calling-peer:', _self._peerId);
      _self._qc = quickconnect(
        'https://switchboard.rtc.io',
        {
          room: roomId,
          iceServers: freeice()
        })
        .addStream(_self._localStream)
        .createDataChannel('test')
        .on('call:started', function(peerId, peerConnection, data) {
          // TODO: handle peerConn properly

          // how about multiple call started -> allow only 1 call
          _self._remoteStream = peerConnection.getRemoteStreams()[0];
          _self.emit(Topics.STREAM_REMOTE_RECEIVED);
        })
        .on('channel:opened:test', function(peerId, dataChannel) {
          // chat opened
          _self._dataChannel = dataChannel;
          console.log('chat:opened');
          dataChannel.onmessage = function(evt) {
            if (_self._state !== ConnectionStatus.MATCHED) {
              return;
            }
            // TODO: validate message?
            var deserializedMessage = JSON.parse(evt.data);
            var presentableMessage = MessageUtil.convertToPresentableMessage(
               deserializedMessage, _self._peerId);
            _self._messages.push(presentableMessage);
            _self.emit(Topics.MESSAGE_CHANGED);
          };
        })
        .on('channel:closed', function(id) {
          // chat closed
          console.log('chat:closed');
        })
        .on('call:ended', function(id) {
          console.log('call:ended');
          if (_self._state === ConnectionStatus.MATCHED) {
            _self._cleanUpAndRequestNewPartner();
          }
        });
    });
  });
};

var STATE_INSTANCE = new State();
window.state = STATE_INSTANCE;

module.exports = STATE_INSTANCE;
