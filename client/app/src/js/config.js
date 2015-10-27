const SERVER_IP = "trananhcuong.com";
const PEER_KEY = "peerjs";
const PEER_PORT = 8001;
const SOCKET_PORT = 8002;

const Config = {
  WEBRTC_MEDIA_CONSTRAINTS: {
    video: {
      mandatory: {
        maxWidth: 320,
        maxHeight: 180
      }
    },
    audio: true
  },

  PEER_SERVER_OPTIONS: {
    host: SERVER_IP,
    port: PEER_PORT,
    key: PEER_KEY
  },

  WEB_SERVER: 'https://' + SERVER_IP + ":" + SOCKET_PORT

};

module.exports = Config;
