var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require("react/lib/Object.assign");
var _ = require('lodash');

var ConstConnectionStatus = require('../constants/ConstConnectionStatus');
var ConstActionType = require('../constants/ConstActionType');


var CONNECTION_EVENT = 'connection_change';
var _status = ConstConnectionStatus.NONE; // none, requesting, connected
var _peerCall = null;
var _socketIoConnection = null;

var ConnectionStatusStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CONNECTION_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CONNECTION_EVENT, callback);
  },

  getStatus: function() {
    return _status;
  },

  getSocketIoConnection: function() {
    return _socketIoConnection;
  },

  getPeerCall: function() {
    return _peerCall;
  },

});

ConnectionStatusStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {
    case ConstActionType.SET_CONNECTION_STATUS:
      _status = action.status;
      ConnectionStatusStore.emitChange();
      break;

    case ConstActionType.BUTTON_NEXT:
      if (_status === ConstConnectionStatus.REQUESTING) {
        return;
      }

      if (!_.isEmpty(_peerCall)) {
        console.log('closing call');
        _peerCall.close();
      }

      _status = ConstConnectionStatus.REQUESTING;
      _socketIoConnection.emit('request-new-partner');
      ConnectionStatusStore.emitChange();
      break;

    case ConstActionType.CALL_CLOSED_PASSIVELY:
      if (!_.isEmpty(_peerCall)) {
        console.log('closing call');
        _peerCall.close();
      }

      _status = ConstConnectionStatus.REQUESTING;
      _socketIoConnection.emit('request-new-partner');
      ConnectionStatusStore.emitChange();
      break;

    case ConstActionType.SOCKET_IO_CONNECTED:
      _socketIoConnection = action.socket;
      ConnectionStatusStore.emitChange();
      break;

    case ConstActionType.PEER_CALL_CREATED:
      _peerCall = action.call;
      ConnectionStatusStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = ConnectionStatusStore;
