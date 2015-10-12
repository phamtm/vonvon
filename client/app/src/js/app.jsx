const App = require('./components/App.jsx');
const React = require('react');

require('browsernizr/test/webrtc/getusermedia');
require('browsernizr/test/webrtc/peerconnection');
// make sure to do this _after_ importing the tests
// or if you need access to the modernizr instance:
const Modernizr = require('browsernizr');

// if (!Modernizr.getusermedia && !Modernizr.peerconnection) {
//   window.location.replace('not-supported.html');
// } else {
// }

React.render(
  <App />,
  document.getElementById('appComponent')
);

