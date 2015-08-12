var React = require('react');
var StreamStore = require('../stores/StreamStore');


var VideoBoxLocal = React.createClass({
	getInitialState: function() {
		return {
			localStream: StreamStore.getLocalStream()
		};
	},

	_onStreamChange: function() {
		this.setState({
			localStream: StreamStore.getLocalStream()
		});
	},

	componentDidMount: function() {
		StreamStore.addChangeListener(this._onStreamChange);
	},

	render: function() {
		var localStream = this.state.localStream;
		var localStreamSrc = window.URL.createObjectURL(localStream);
		return (
			<div className={"card"}>
				<div className={"card-image waves-effect waves-block waves-light"}>
					<video autoPlay muted="muted" src={localStreamSrc}></video>
				</div>
			</div>
			);
	}
});

module.exports = VideoBoxLocal;
