var AppDispatcher = require('../dispatcher/AppDispatcher');
var ConstActionType = require('../constants/ConstActionType');
var ConstConnectionStatus = require('../constants/ConstConnectionStatus');


var ConnectionStatusAction = {
	setConnectionStatus: function(status) {
		AppDispatcher.handleServerAction({
			type: ConstActionType.SET_CONNECTION_STATUS,
			status: status
		});
	},

	setSocketIoConnection: function(socket) {
		AppDispatcher.handleServerAction({
			type: ConstActionType.SOCKET_IO_CONNECTED,
			socket: socket
		});
	},

	setPeerCall: function(call) {
		AppDispatcher.handleServerAction({
			type: ConstActionType.PEER_CALL_CREATED,
			call: call
		});
	},

	closeCallPassively: function() {
		AppDispatcher.handleServerAction({
			type: ConstActionType.CALL_CLOSED_PASSIVELY,
		});
	}
};

module.exports = ConnectionStatusAction;
