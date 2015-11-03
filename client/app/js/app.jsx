const App = require('./components/app.jsx');
const ReactDOM = require('react-dom');
const React = require('react');
const connectionManager = require('./connection-manager');

require('browsernizr/test/webrtc/getusermedia');
require('browsernizr/test/webrtc/peerconnection');
// make sure to do this _after_ importing the tests
// or if you need access to the modernizr instance:
const Modernizr = require('browsernizr');

if (!Modernizr.getusermedia && !Modernizr.peerconnection) {
  window.location.replace('not-supported.html');
}

connectionManager.initApp();

ReactDOM.render(
  <App />,
  document.getElementById('appComponent')
);
