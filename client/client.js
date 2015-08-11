// ================ UTILITIES ================= //
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

var err = function(err) {
  console.log(err);
};


// =============== GLOBAL VARIABLES ================ //
// var $localVideo = document.getElementById('local');
// var $remoteVideo = document.getElementById('remote');
var $localVideo = $('#local');
var $remoteVideo = $('#remote');
var $nextButton = $('#next');
var $chatSubmitButton = $('#btn-submit');
var $chatMessagesUl = $('#chat-messages');
var $chatInput = $('#chat-input');
var $loader = $('#loader');
var $warningModal = $('#warning-modal');

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
    console.log('Requesting new partner..');
    if (!isRequesting) {
      $nextButton.attr('disabled', true);
      $nextButton.html('requesting new partner..');
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
      $localVideo.attr('src', window.URL.createObjectURL(localStream));
    },
    function(error) {
      $warningModal.openModal();
    }
  );

  // 2. Request for new partner id
  $nextButton.click(requestNewPartner);
  socket.on('connection-created', function (data) {
    const localId = data.id;
    var partnerId;
    var call;
    var peerDataConnection;

    // 1. Create a new connection to the PeerJs-server
    console.log('Connection created, id::' + localId);
    var peerConnection = new Peer(data.id, PEER_SERVER_OPTIONS);


    // 2. When received a new partner id
    socket.on('matched', function (data) {
      isRequesting = false;
      $nextButton.removeAttr('disabled');
      $nextButton.html('Next');
      // bogus partnerId
      if (_.isEmpty(data) || !_.has(data, 'partnerId')) {
        return;
      }
      partnerId = data.partnerId;
      console.log('Partner matched, partner-id::' + data.partnerId);

      if (localId.localeCompare(partnerId) < 0) {
        console.log("Calling peer::" + data.partnerId);
        call = peerConnection.call(data.partnerId, LOCAL_STREAM);
        peerDataConnection = peerConnection.connect(partnerId);
        setUpChat(peerDataConnection);

        call.on('close', function() {
          console.log('ending your call');
          call.close();
          cleanChat();
          toggleRemoteLoader();
          requestNewPartner();
        });

        // 2. Request for new partner id
        $nextButton.off('click');
        $nextButton.click(function() {
          console.log('Ending a call by caller..');
          call.close();
          cleanChat();
          toggleRemoteLoader();
          requestNewPartner();
        });

        // user with lower id call user with higher id
        call.on('stream', function(remoteStream) {
          // Show stream in some video/canvas element.
          console.log("Receiving remote stream");
          $remoteVideo.attr('src', window.URL.createObjectURL(remoteStream));
          toggleRemoteLoader();
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
          call.answer(LOCAL_STREAM); // Answer the call with an A/V stream.
          call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            console.log("Receiving remote stream");
            toggleRemoteLoader();
            $remoteVideo.attr('src', window.URL.createObjectURL(remoteStream));
          });
        });

        peerConnection.on('connection', function(dataConnection) {
          setUpChat(dataConnection);
        });
      }
    })
  });
});

/*=============================== UTILITY ===================================*/
var setUpChat = function (peerDataConnection) {
  $chatInput.keypress(function (e) {
    if (e.which == 13) {
      handleChatSubmission(peerDataConnection);
    }
  });

  $chatSubmitButton.click(function() {
    handleChatSubmission(peerDataConnection);
  });

  peerDataConnection.on('data', function (data) {
    console.log('receiving chat message' + data);
    var remoteText = '<li><strong>Von: </strong>' + data + '</li>';
    $chatMessagesUl.append(remoteText);
  });
};

var handleChatSubmission = function(peerDataConnection) {
  var text = $chatInput.val();
  if (text !== null && text !== '') {
    var localText = '<li><strong>You: </strong>' + text + '</li>';
    $chatMessagesUl.append(localText);
    console.log('sending chat message::' + text);
    peerDataConnection.send(text);

    // clear local input
    $chatInput.val('');
  }
};

var toggleRemoteLoader = function() {
  if ($loader.is(':visible')) {
    $loader.css('display', 'none');
    $remoteVideo.css('display', 'block');
  } else {
    $loader.css('display', 'block');
    $remoteVideo.css('display', 'none');
  }
};

var cleanChat = function() {
  $chatMessagesUl.html('');
};
