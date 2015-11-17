const Config = require('./config.js');
const ConnectionStatus = require('./constants/connection-status');
const EventEmitter = require('events').EventEmitter;
const io = require('socket.io-client');
const Peer = require('peerjs_fork_firefox40');
const Topics = require('./constants/topics');
const MessageType = require('./constants/message-type');
const MessageUtil = require('./utils/message-utils');
const log = require('./utils/log');

const $window = $(window);
const pingSound= new Audio('../sound/ping.ogg');
var iceServers = [];


/**
 * Constructor
 */
const ConnectionManager = function() {
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
  this._peerMediaConn = null;
  this._peerDataConn = null;

  // Video streams
  this._localStream = null;
  this._remoteStream = null;

  // Show/hide webcam preference, default to true
  this._enableMediaStream = true;

  // The last time that user request for new partner
  this._lastRequestTime = null;

  // Notification sound
  this._isTabFocused = true;
  this._alreadyPlaySound = false;
};

ConnectionManager.prototype = Object.create(EventEmitter.prototype);

// Getters
ConnectionManager.prototype.getState = function() {
  return this._state;
};

ConnectionManager.prototype.getMessages = function() {
  return this._messages;
};

ConnectionManager.prototype.getLocalStream = function() {
  return this._localStream;
};

ConnectionManager.prototype.getRemoteStream = function() {
  return this._remoteStream;
};

ConnectionManager.prototype.getState = function() {
  return this._state;
};

ConnectionManager.prototype.isDataConnectionOpen = function() {
  return (!!this._peerDataConn && !!this._peerDataConn.open);
};

ConnectionManager.prototype.isMediaConnectionOpen = function() {
  return (!!this._peerMediaConn && !!this._peerMediaConn.open);
};

// State events
ConnectionManager.prototype.onStateChange = function(cb) {
  this.addListener(Topics.STATE_CHANGED, cb);
};

// Chat events
ConnectionManager.prototype.onMessageReceived = function(cb) {
  this.addListener(Topics.MESSAGE_RECEIVED, cb);
};

ConnectionManager.prototype.onMessageSend = function(cb) {
  this.addListener(Topics.MESSAGE_SEND, cb);
};

ConnectionManager.prototype.onMessageChange = function(cb) {
  this.addListener(Topics.MESSAGE_CHANGED, cb);
};

ConnectionManager.prototype.onChatChannelOpened = function(cb) {
  this.addListener(Topics.DATA_CHANNEL_OPENED, cb);
};

ConnectionManager.prototype.onChatChannelClosed = function(cb) {
  this.addListener(Topics.CHAT_CHANNEL_CLOSED, cb);
};

// Stream events
ConnectionManager.prototype.onStreamLocalReceived = function(cb) {
  this.addListener(Topics.STREAM_LOCAL_RECEIVED, cb);
};

ConnectionManager.prototype.onStreamRemoteReceived = function(cb) {
  this.addListener(Topics.STREAM_REMOTE_RECEIVED, cb);
};

// Partner's ID changed event
ConnectionManager.prototype.onPartnerIdChanged = function(cb) {
  this.addListener(Topics.ID_PARTNER_CHANGED, cb);
};

// Local's ID changed event
ConnectionManager.prototype.onLocalIdChanged = function(cb) {
  this.addListener(Topics.ID_LOCAL_CHANGED, cb);
};

// Next event
ConnectionManager.prototype.onRequestNextPartner = function(cb) {
  this.addListener(Topics.REQUEST_NEW_PARTNER, cb);
};

// Toggle webcam event
ConnectionManager.prototype.notifyWebcamToggled = function() {
  log.debug('webcam clicked');
  this._enableMediaStream = !this._enableMediaStream;
  this.sendMediaStreamControllMessage(this._enableMediaStream);
};

ConnectionManager.prototype.sendMessage = function(transferableMessage) {
  if (!!this._peerDataConn &&
      !!this._peerDataConn.open &&
      this._state === ConnectionStatus.MATCHED &&
      !!transferableMessage) {
    const serializedMessage = JSON.stringify(transferableMessage);
    this._peerDataConn.send(serializedMessage);

    // TODO: check if this is media control message
    if (transferableMessage.content.type === MessageType.TEXT
        || transferableMessage.content.type === MessageType.STICKER) {
      const presentableMessage = MessageUtil.convertToPresentableMessage(
          transferableMessage, this._localId, true);
      presentableMessage.authorName = 'You';
      this._messages.push(presentableMessage);
      this.emit(Topics.MESSAGE_CHANGED);
    }
  }
};


ConnectionManager.prototype.sendTextMessage = function(text) {
  if (text) {
    const transferableMessage = MessageUtil.convertToTransferableTextMessage(text);
    this.sendMessage(transferableMessage);
  }
};

ConnectionManager.prototype.sendStickerMessage = function(stickerCode) {
  if (stickerCode) {
    const transferableMessage = MessageUtil.convertToTransferableStickerMessage(stickerCode);
    this.sendMessage(transferableMessage);
  }
};

ConnectionManager.prototype.sendMediaStreamControllMessage = function(turnMediaStreamOn) {
  if (turnMediaStreamOn !== true && turnMediaStreamOn !== false) {
    return;
  }
  const mediaStreamControlMessage = MessageUtil.convertToMediaStreamControlMessage(turnMediaStreamOn);
  this.sendMessage(mediaStreamControlMessage);
};

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

ConnectionManager.prototype._closeConn = function() {
  // if (!this._peerConn || this._peerConn.disconnected || this._peerConn.destroyed) {
  //   return;
  // }
  if (this._peerMediaConn && this._peerMediaConn.open) {
    this._peerMediaConn.close();
  }

  if (this._peerDataConn && this._peerDataConn.open) {
    this._peerDataConn.close();
  }
};

ConnectionManager.prototype._clearMessages = function() {
  this._messages = [];
  this.emit(Topics.MESSAGE_CHANGED);
};

ConnectionManager.prototype._requestNewPartner = function() {
  if (this._state !== ConnectionStatus.REQUESTING) {
    log.debug('Requesting new partner..');
    this._state = ConnectionStatus.REQUESTING;
    this.emit(Topics.STATE_CHANGED);
    this._socket.emit('socket-io::request-new-partner');
  }
};

ConnectionManager.prototype._cleanUpAndRequestNewPartner = function(peerId) {
  if (this._peerId !== null && peerId !== this._peerId) {
     return;
  }
  this._clearMessages();
  this._closeConn();
  this._requestNewPartner();
};

ConnectionManager.prototype._announceWhenDataChannelOpened = function() {
  if (!!this._peerDataConn) {
    this._peerDataConn.on('open', function() {
      this.emit(Topics.DATA_CHANNEL_OPENED);
    }.bind(this));
  }
};

ConnectionManager.prototype._setUpChat = function() {
  if (!this._peerDataConn && !this._peerDataConn.open) {
    log.debug('peerDataConn:error:: cannot setup chat, already closed');
    return;
  }

  this._peerDataConn.on('data', function(data) {
    if (this._state !== ConnectionStatus.MATCHED) {
      return;
    }

    const deserializedMessage = JSON.parse(data);
    const presentableMessage = MessageUtil.convertToPresentableMessage(
       deserializedMessage, this._peerId, false);
    this._messages.push(presentableMessage);

    // if first message and the tab is not focused, the play a 'ping' sound
    if (!this._isTabFocused && !this._alreadyPlaySound) {
      pingSound.currentTime = 0;
      pingSound.play();
      this._alreadyPlaySound = true;
    }

    this.emit(Topics.MESSAGE_CHANGED);
  }.bind(this));

  this._peerDataConn.on('close', function() {
    this.emit(Topics.CHAT_CHANNEL_CLOSED);
    // potential bug: what if media connection also close at this time?
    this._cleanUpAndRequestNewPartner(this._peerId);
  }.bind(this));
};

ConnectionManager.prototype._initConnections = function() {
  const _self = this;
  this._socket = io.connect(
    Config.WEB_SERVER,
    {'sync disconnect on unload': true}
  );

  // setInterval(function() {
  //   // Re-retrieved local stream
  //   if (this._localStream && this._localStream.getVideoTracks() &&
  //       this._localStream.getVideoTracks().length) {
  //     const videoTrack = this._localStream.getVideoTracks()[0];
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
  // //     if (!this._peerMediaConn.open || !this._peerDataConn.open) {
  // //       log.debug("YAHOOOOOOOOOOOOOOOO");
  // //       this._cleanUpAndRequestNewPartner();
  // //     }
  // //   }
  //   }.bind(this), 3000
  // );

  this.onRequestNextPartner(function() {
    const curTime = new Date();
    if (this._lastRequestTime) {
      const timeDelta = (curTime - this._lastRequestTime)*1.0/1000;
      if (timeDelta < Config.MIN_CHAT_INTERVAL) {
        return;
      }
    }

    this._lastRequestTime = curTime;

    log.debug('Next request');
    this._cleanUpAndRequestNewPartner(this._peerId);
  }.bind(this));

  this._socket.on('socket-io::connection-created', function(data) {
    $(window).blur(function() {
      _self._isTabFocused = false;
    });

    $(window).focus(function() {
      _self._isTabFocused = true;
      _self._alreadyPlaySound = false;
    });

    _self._localId = data.id;
    _self.emit(Topics.ID_LOCAL_CHANGED);
    var PARTNER_ID;

    // Create a new connection to the PeerJs-server
    log.debug('Connection created, id::' + _self._localId);
    Config.PEER_SERVER_OPTIONS.iceServers = iceServers;
    log.debug('Connection created, id::' + _self._localId);
    _self._peerConn = new Peer(data.id, Config.PEER_SERVER_OPTIONS);

    // Received a call
    _self._peerConn.on('call', function(remoteCall) {
      _self._peerMediaConn = remoteCall;

      remoteCall.on('close', function() {
        _self._cleanUpAndRequestNewPartner();
      });

      log.debug("Receiving a call..")
      remoteCall.answer(_self._localStream); // Answer the call with an A/V stream.
      remoteCall.on('stream', function(remoteStream) {
        _self._remoteStream = remoteStream;
        _self.emit(Topics.STREAM_REMOTE_RECEIVED);
      });
    });

    _self._peerConn.on('disconnected', function() {
      log.debug('PeerConn:disconnected');
    });

    // Received chat data
    _self._peerConn.on('connection', function(dataConnection) {
      _self._peerDataConn = dataConnection;
      _self._announceWhenDataChannelOpened();
      _self._setUpChat(dataConnection);
      _self.emit(Topics.DATA_CHANNEL_OPENED);
    });

    // When received a new partner id
    _self._socket.on('socket-io::matched', function (data) {
      _self._lastRequestTime = new Date();
      // Matched with a partner
      if (!data || !data.hasOwnProperty('partnerId')) {
        return;
      }
      log.debug('Partner matched, partner-id::' + data.partnerId);
      PARTNER_ID = data.partnerId;
      _self._peerId = PARTNER_ID;
      _self.emit(Topics.ID_PARTNER_CHANGED);
      _self._state = ConnectionStatus.MATCHED;
      _self.emit(Topics.STATE_CHANGED, ConnectionStatus.MATCHED);

      if (_self._localId.localeCompare(PARTNER_ID) < 0) {
        log.debug("Calling peer::" + PARTNER_ID);
        _self._peerDataConn = _self._peerConn.connect(PARTNER_ID);
        _self._announceWhenDataChannelOpened();
        _self._setUpChat(_self._peerDataConn);

        // If the user disable localStream, or no device -> do not call media
        _self._peerMediaConn = _self._peerConn.call(PARTNER_ID, _self._localStream);

        if (_self._peerMediaConn) {
          _self._peerMediaConn.on('close', function() {
            log.debug('ending your call');
            _self._cleanUpAndRequestNewPartner(PARTNER_ID);
          });

          // user with lower id call user with higher id
          _self._peerMediaConn.on('stream', function(remoteStream) {
            _self._remoteStream = remoteStream;
            _self.emit(Topics.STREAM_REMOTE_RECEIVED);
          });
        }
      }
    });
  });
};

ConnectionManager.prototype._getLocalMedia = function(next) {
  // Capture local media
  navigator.getUserMedia(
    Config.WEBRTC_MEDIA_CONSTRAINTS,
    function(localStream) {
      if (localStream.getVideoTracks().length < 1) {
        // TODO: proper error message
        window.location.replace('not-supported.html');
      }
      this._localStream = localStream;
      this.emit(Topics.STREAM_LOCAL_RECEIVED);
      next();
    }.bind(this),
    function() {
      window.location.replace('not-supported.html');
    }
  );
};

ConnectionManager.prototype.initApp = function() {
  var _self = this;
  // Call XirSys ICE servers
  $.ajax({
    url: "https://service.xirsys.com/ice",
    data: {
      ident: "frank",
      secret: "b13a5078-8200-11e5-904c-ba30a081df71",
      domain: "www.trananhcuong.com",
      application: "default",
      room: "default",
      secure: 1
    },

    success: function (data, status) {
      // data.d is where the iceServers object lives
      iceServers = data.d.iceServers;
      _self._getLocalMedia(function() {
        _self._initConnections();
      });
    },
    async: true
  });
};

const CONNECTION_MANAGER_INSTANCE = new ConnectionManager();
window.cm = CONNECTION_MANAGER_INSTANCE;
module.exports = CONNECTION_MANAGER_INSTANCE;
