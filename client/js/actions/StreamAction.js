var AppDispatcher = require('../dispatcher/AppDispatcher');
var ConstActionType = require('../constants/ConstActionType');

var StreamAction = {

	setLocalStream: function(stream) {
		AppDispatcher.handleViewAction({
			type: ConstActionType.SET_LOCAL_STREAM,
			stream: stream
		});
	},

	setRemoteStream: function(stream) {
		AppDispatcher.handleServerAction({
			type: ConstActionType.SET_REMOTE_STREAM,
			stream: stream
		});
	}
};

module.exports = StreamAction;
