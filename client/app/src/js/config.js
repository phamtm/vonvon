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
    host: 'localhost',
    port: 8001,
    key: 'peerjs'
  },

  WEB_SERVER: 'localhost:8002'

};

module.exports = Config;
