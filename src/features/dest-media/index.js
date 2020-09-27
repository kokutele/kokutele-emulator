// @flow

import React, { useRef, useEffect } from 'react'
import localLoopbackEmulator from '../../transports/local-loopback-emulator'
import MyVideoDecoder from './MyVideoDecoder'


type PropTypes = {
  title: string;
  width: number;
  height: number;
}

export default function(props:PropTypes):React.Node {
  const { title, width, height } = props
  const canvas = useRef()

  // seq 1: receive video
  // seq 2: depay rtp
  // seq 3: decode vp8
  // seq 4: render decoded
  useEffect(() => {
    const cvs = canvas.current

    if( cvs ) {
      cvs.width = width; cvs.height = height
      const ctx = cvs.getContext('2d')
      const videoDecoder = new MyVideoDecoder() // default is `vp8`

      videoDecoder.start( async chunk => {
        // seq 4
        const img = await chunk.createImageBitmap()
        ctx.drawImage(img, 0, 0, width, height)
      }, err => {
        console.warn( err )
      })

      // seq 1
      localLoopbackEmulator.on('message-from:sender', chunk => {
        // seq 2: skip ... todo

        // seq 3
        videoDecoder.decode( chunk )
      })
    }

    return function cleanup() {
      localLoopbackEmulator.removeEventListeners('message-from:source')
    }
  }, [width, height])

  return (
    <div className="DestMedia">
      <h2>{title}</h2>
      <div>
        <canvas ref={ e => canvas.current = e }></canvas>
      </div>
    </div>
  )
}