var SERVER_IP = "trananhcuong.com";
var PEER_KEY = "peerjs";
var PEER_PORT = 8001;
var SOCKET_PORT = 8002;

var Config = {
  WEBRTC_MEDIA_CONSTRAINTS: {
    video: true,
    // video: {
    //   mandatory: {
    //     maxWidth: 320,
    //     maxHeight: 180
    //   }
    // },
    audio: true
  },

  PEER_SERVER_OPTIONS: {
    host: SERVER_IP,
    port: PEER_PORT,
    key: PEER_KEY
  },

  WEB_SERVER: SERVER_IP + ":" + SOCKET_PORT

};

module.exports = Config;
