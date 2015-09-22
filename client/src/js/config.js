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
    host: 'vonvon.vn',
    port: 8001,
    key: 'peerjs'
  },

  WEB_SERVER: 'vonvon.vn:8002'

};

module.exports = Config;
