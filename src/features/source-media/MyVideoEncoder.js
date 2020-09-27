// @flow

/**
 * video エンコーダ
 * 
 */
type PropTypes = {
  codec: string;
  width: number;
  height: number;
  framerate: number;
}

export default class MyVideoEncoder {
  _reqKeyFrame: boolean;
  _configure: Object;
  _interval: number;
  _seq: number;
  _videoReader: VideoTrackReader;
 
  constructor(props:PropTypes) {
    const { codec, width, height, framerate } = Object.assign( {}, {
      codec: 'vp8', width: 640, height: 480, framerate: 30
    }, props )

    this._reqKeyFrame = false
    this._configure = { codec, width, height, framerate }
    this._interval = framerate * 2
    this._seq = 0
  }

  requestKeyFrame() {
    this._reqKeyFrame = true
  }

  start(track: MediaStreamTrack, callback: function, errCallback: function): void {
    const videoEncoder = new window.VideoEncoder({
      output: callback,
      error: errCallback
    })
    videoEncoder.configure( this._configure )

    this._videoReader = new window.VideoTrackReader(track)

    this._videoReader.start( frame => {
      const keyFrame = (this._reqKeyFrame || this._seq === 0)

      videoEncoder.encode(frame, {keyFrame})
      this._reqKeyFrame = false

      this._seq = ++this._seq % this._interval
    })
  }

  stop() {
    this._videoReader.stop()
  }
}

