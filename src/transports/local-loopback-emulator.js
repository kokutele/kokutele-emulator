//@flow

import EventEmitter from 'events'

type PropTypes = {
}

class LocalLoopbackEmulator extends EventEmitter {
  constructor(props:PropTypes) {
    super()
  }

  send( from:string, chunk:{ type: String, timestamp: number, duration: ?number, data: ArrayBuffer } ) {
    const out = { type: chunk.type, timestamp: chunk.timestamp, duration: chunk.duration, data: chunk.data }
    this.emit( `message-from:${from}`, new window.EncodedVideoChunk(out) )
  }
}

export default new LocalLoopbackEmulator({})