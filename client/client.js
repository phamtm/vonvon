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

var isRequesting = false;
var WEB_SERVER = 'toidocbao.org:8002';
var socket = io.connect(WEB_SERVER, {
  'sync disconnect on unload': true
});
var LOCAL_STREAM = null;

var requestNewPartner = function(event) {
    console.log('Requesting new partner 1..');
    if (!isRequesting) {
      $nextButton.attr('disabled', true);
      isRequesting = true;
      socket.emit('request-new-partner');
    }
}
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
  $nextButton.click(requestNewPartner);
  socket.on('connection-created', function (data) {
    const localId = data.id;
    var partnerId;
    var call;

    // 1. Create a new connection to the PeerJs-server
    console.log('Connection created, id::' + localId);
    var peerConnection = new Peer(data.id, PEER_SERVER_OPTIONS);


    // 2. When received a new partner id
    socket.on('matched', function (data) {
      isRequesting = false;
      $nextButton.removeAttr('disabled');
      // bogus partnerId
      if (typeof(data) === 'undefined' || !data.hasOwnProperty('partnerId')) {
        return;
      }
      partnerId = data.partnerId;
      console.log('Partner matched, partner-id::' + data.partnerId);

      if (localId.localeCompare(partnerId) < 0) {
        console.log("Calling peer::" + data.partnerId);
        call = peerConnection.call(data.partnerId, LOCAL_STREAM);

        call.on('close', function() {
          console.log('ending your call');
          call.close();
          requestNewPartner();
        });

        // 2. Request for new partner id
        $nextButton.off('click');
        $nextButton.click(function() {
          console.log('Ending a call by caller..');
          call.close();
          requestNewPartner();
        });

        // user with lower id call user with higher id
        call.on('stream', function(remoteStream) {
          // Show stream in some video/canvas element.
          console.log("Receiving remote stream");
          $remoteVideo.src = window.URL.createObjectURL(remoteStream);
        });
      }

      // Answer
      else {
        peerConnection.on('call', function(call) {
          // 2. Request for new partner id
          $nextButton.off('click');
          $nextButton.click(function() {
            console.log('ending a call from receiver');
            call.close();
            requestNewPartner();
          });

          call.on('close', function() {
            call.close();
            requestNewPartner();
          });

          console.log("Receiving a call..")
          console.log(LOCAL_STREAM);
          call.answer(LOCAL_STREAM); // Answer the call with an A/V stream.
          call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            console.log("Receiving remote stream");
            if (typeof(remoteStream) !== 'undefined') {
              console.log('GOOD remote stream');
              console.log(remoteStream);
            }
            $remoteVideo.src = window.URL.createObjectURL(remoteStream);
          });
        });
      }
    })
  });
})
