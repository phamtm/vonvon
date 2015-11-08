const SERVER_IP = "trananhcuong.com";
const PEER_KEY = "peerjs";
const PEER_PORT = 8001;
const SOCKET_PORT = 8002;

const Config = {

  WEBRTC_MEDIA_CONSTRAINTS: {
    video: {
      mandatory: {
        // maxWidth: 640,
        // maxHeight: 360
      }
    },
    audio: true
  },

  PEER_SERVER_OPTIONS: {
    host: SERVER_IP,
    port: PEER_PORT,
    key: PEER_KEY,
    // debug: 3
  },

  WEB_SERVER: 'https://' + SERVER_IP + ":" + SOCKET_PORT,

  // Minimum interval for chat in seconds
  MIN_CHAT_INTERVAL: 10

};

module.exports = Config;
