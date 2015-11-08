const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Config = require('../../config');
const ConnectionStatus = require('../../constants/connection-status');
const connectionManager = require('../../connection-manager');
const Topics = require('../../constants/topics');
const log = require('../../utils/log');


const ButtonNext = React.createClass({

  _handleClick: function() {
    log.debug('next button clicked');
    connectionManager.emit(Topics.REQUEST_NEW_PARTNER);
  },

  render: function() {
    const transitionTimeout = Config.MIN_CHAT_INTERVAL * 1000;
    return (
      <button className="btn-justified-large button-next"
              onClick={this._handleClick} >
        <span className="btn-content">Next</span>
        <ReactCSSTransitionGroup transitionName="btn-progress-transition"
                                 transitionAppear={true} transitionAppearTimeout={transitionTimeout}
                                 transitionEnter={false} transitionLeave={false} >
          <span className="btn-progress"></span>
        </ReactCSSTransitionGroup>
      </button>
    );
  }
});

module.exports = ButtonNext;
