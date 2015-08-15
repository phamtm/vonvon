var keyMirror = require('react/lib/keyMirror');


var Topics = keyMirror({
	STATE_CHANGED: null,
	STREAM_LOCAL_RECEIVED: null,
	STREAM_REMOTE_RECEIVED: null,
	STREAM_LOCAL_CHANGED: null,
	MESSAGE_RECEIVED: null,
	MESSAGE_SEND: null,
	MESSAGE_CHANGED: null,
	REQUEST_NEW_PARTNER: null
});

module.exports = Topics;
