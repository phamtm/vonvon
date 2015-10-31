const App = require('./components/app.jsx');
const React = require('react');

require('browsernizr/test/webrtc/getusermedia');
require('browsernizr/test/webrtc/peerconnection');
// make sure to do this _after_ importing the tests
// or if you need access to the modernizr instance:
const Modernizr = require('browsernizr');

if (!Modernizr.getusermedia && !Modernizr.peerconnection) {
  window.location.replace('not-supported.html');
}

React.render(
  <App />,
  document.getElementById('appComponent')
);

// const tour = new Shepherd.Tour({
//   defaults: {
//     classes: 'shepherd-theme-arrows'
//   }
// });

// tour.addStep('example', {
//   title: 'Example Shepherd',
//   text: 'Creating a Shepherd is easy too! Just create ...',
//   attachTo: '.remote-video-placeholder bottom',
//   advanceOn: '.btn-justified-large click'
// });

// tour.start();
