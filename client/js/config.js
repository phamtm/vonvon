var Config = {
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
    host: 'toidocbao.org',
    port: 8001,
    key: 'peerjs'
  },

  WEB_SERVER: 'toidocbao.org:8002'

};

module.exports = Config;
