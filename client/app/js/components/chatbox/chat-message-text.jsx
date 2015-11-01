const React = require('react');


const ChatMessageText = React.createClass({

  render: function() {
    return (
      <div className={'message-text'}>
        { this.props.textMessage }
      </div>
    );
  }

});


module.exports = ChatMessageText;
