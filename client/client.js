// ================ UTILITIES ================= //
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

var err = function(err) {
  console.log(err);
};


// =============== GLOBAL VARIABLES ================ //
var $localVideo = document.getElementById('local');
var $remoteVideo = document.getElementById('remote');
var $nextButton = $('#next');

var WEBRTC_MEDIA_CONSTRAINTS = {
  video: true,
  audio: true
};

var PEER_SERVER_OPTIONS = {
  host: 'toidocbao.org',
  port: 8001,
  key: 'peerjs'
};

var WEB_SERVER = 'toidocbao.org:8002';
var socket = io.connect(WEB_SERVER);
var LOCAL_STREAM = null;
var CALL_RECEIVED = false;

// =============== SOCKET EVENT HANDLERS =============== //
$('document').ready(function() {
  // Capture local media
  navigator.getUserMedia(
    WEBRTC_MEDIA_CONSTRAINTS,
    function(localStream) {
      // render local stream in browser
      console.log('create local stream');
      LOCAL_STREAM = localStream;
      $localVideo.src = window.URL.createObjectURL(localStream);
    },
    err
  );

  // 2. Request for new partner id
  $nextButton.click(function() {
    console.log('Requesting new partner..')
    CALL_RECEIVED = false;
    socket.emit('request-new-partner');
  })

  socket.on('connection-created', function (data) {
    console.log('Connection created, id::' + data.id);
    // 1. Create a new connection to the PeerJs-server
    var peerConnection = new Peer(data.id, PEER_SERVER_OPTIONS);

    // 2. When received a new partner id
    socket.on('matched', function (data) {
      console.log('Partner matched, partner-id::' + data.partnerId);

      var call = peerConnection.call(data.partnerId, LOCAL_STREAM);
      console.log(call);
      console.log("Calling peer::" + data.partnerId);
      call.on('stream', function(remoteStream) {
        // Show stream in some video/canvas element.
        console.log("Receiving remote stream");
        $remoteVideo.src = window.URL.createObjectURL(remoteStream);
      });

      // Answer
      peerConnection.on('call', function(call) {
        CALL_RECEIVED = true;
        navigator.getUserMedia(
          WEBRTC_MEDIA_CONSTRAINTS,

          function(localStream) {
            console.log("Receiving a call..")
            call.answer(localStream); // Answer the call with an A/V stream.
            call.on('stream', function(remoteStream) {
              // Show stream in some video/canvas element.
              console.log("Receiving remote stream");
              $remoteVideo.src = window.URL.createObjectURL(remoteStream);
            });
          },
          err
        );
      });
    })
  });
})
