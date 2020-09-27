//@flow

type PropTypes = {
  codec: ?string
}

export default class MyVideoDeocder {
  _configure: {codec: string};
  _videoDecoder: VideoDecoder;

  constructor( props:PropTypes ) {
    const { codec } = Object.assign({}, {codec: 'vp8'}, props)
    this._configure = { codec }
  }

  start( callback: function, errCallback: function ) {
    this._videoDecoder = new window.VideoDecoder({
      output: callback, 
      error: errCallback
    })
    this._videoDecoder.configure(this._configure)
  }

  decode( chunk: {type: string, timestamp: number, duration: ?number, data: ArrayBuffer }) {
    if( this._videoDecoder) {
      this._videoDecoder.decode(chunk)
    }
  }

  stop() {
    this._videoDecoder = null
  }
}