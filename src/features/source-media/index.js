// @flow
import React, { useRef, useState, useCallback, useEffect } from 'react'

import MyVideoEncoder from './MyVideoEncoder'
import startSourceVideo from './startSourceVideo'
import localLoopbackEmulator from '../../transports/local-loopback-emulator'


type PropTypes = {
  title: string;
  height: number;
  width: number;
}


/**
 * JSX
 * 
 */
export default function(props:PropTypes): React.Node {
  const { title, height, width } = props
  const video = useRef()
  const videoEncoder = useRef()
  const [started, setStarted] = useState( false )

  // 終了処理
  useEffect(() => {
    return function cleanup() {
      if( videoEncoder.current ) {
        videoEncoder.current.stop()
      }
    }
  }, [])

  // 1. source canvas 開始 -> video track 取得
  // 2. vp8enc
  // 3. rtp pay
  // 4. local loopback emulator に送信
  const handleClick = useCallback(() => {
    setStarted(true)

    // sequence 1:
    startSourceVideo({ video: video.current, width, height })
      .then( stream => {
        video.current.srcObject = stream
        const [ track ] = stream.getVideoTracks()

        // sequence 2:
        videoEncoder.current = new MyVideoEncoder()
        videoEncoder.current.start(track, chunk => {
          // chunk = { type:string, timestamp:number, duration:null, data: ArrayBuffer}

          // sequence 3: skip ( todo )

          // sequence 4:
          localLoopbackEmulator.send('sender', chunk )

        }, err => {
          console.warn(err)
        })
      }).catch( err => console.warn( err ))

  }, [width, height])

  return (
    <div className="SourceCanvas">
      <h2>{title}</h2>
      <div>
        <button onClick={handleClick} disabled={started}>start</button>
      </div>
      <video ref={ e => { video.current = e }} autoPlay playsInline></video>
    </div>
  )
}