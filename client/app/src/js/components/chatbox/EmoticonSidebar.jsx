var React = require('react');


var EmoticonSidebar = React.createClass({

  render: function() {
    return (
      <div className="emoticon-sidebar">
        <div className="emoticon-list">
          <div className="emoticon-list-item"><img className="img-emoticon" src="img/emoticons/haha.png" alt="emoticon"/></div>
          <div className="emoticon-list-item"><img className="img-emoticon" src="img/emoticons/haha.png" alt="emoticon"/></div>
          <div className="emoticon-list-item"><img className="img-emoticon" src="img/emoticons/haha.png" alt="emoticon"/></div>
          <div className="emoticon-list-item"><img className="img-emoticon" src="img/emoticons/haha.png" alt="emoticon"/></div>
          <div className="emoticon-list-item"><img className="img-emoticon" src="img/emoticons/haha.png" alt="emoticon"/></div>
          <div className="emoticon-list-item"><img className="img-emoticon" src="img/emoticons/haha.png" alt="emoticon"/></div>
          <div className="emoticon-list-item"><img className="img-emoticon" src="img/emoticons/haha.png" alt="emoticon"/></div>
          <div className="emoticon-list-item"><img className="img-emoticon" src="img/emoticons/haha.png" alt="emoticon"/></div>
        </div>
        <div className="emoticon-search-input">
          Search emoticon
        </div>
      </div>
    );
  }

});

module.exports = EmoticonSidebar;
