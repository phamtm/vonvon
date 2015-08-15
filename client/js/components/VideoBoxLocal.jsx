var React = require('react');
var State = require('../State');


var VideoBoxLocal = React.createClass({
	getInitialState: function() {
		return {
			localStream: State.getLocalStream()
		};
	},

	_onStreamChange: function() {
		this.setState({
			localStream: State.getLocalStream()
		});
	},

	componentDidMount: function() {
		State.onStreamLocalReceived(this._onStreamChange);
	},

	render: function() {
		var localStream = this.state.localStream;
		var localStreamSrc = window.URL.createObjectURL(localStream);
		return (
			<div className={"card hide-on-small-only"}>
				<div className={"card-image waves-effect waves-block waves-light"}>
					<video autoPlay muted="muted" src={localStreamSrc}></video>
				</div>
			</div>
			);
	}
});

module.exports = VideoBoxLocal;
