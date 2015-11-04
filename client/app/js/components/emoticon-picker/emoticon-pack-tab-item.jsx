const React = require('react');
const classNames = require('classnames');


const EmoticonPackTabItem = React.createClass({

  render: function() {
    const tabItemClass = classNames(
      'emoticon-tab-li',
      { 'active': !!this.props.active }
    );

    return (
      <li className={tabItemClass} onClick={this.props.onClick}>{this.props.packname}</li>
    );
  }

})

module.exports = EmoticonPackTabItem;
