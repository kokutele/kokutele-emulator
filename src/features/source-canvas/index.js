// @flow
import React, { useRef, useState, useCallback, useEffect } from 'react'


type PropTypes = {
  title: string;
  height: number;
  width: number;
}

type SourceCanvasPropTypes = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

let reqId

/**
 * HH:MM:SS.sss 形式の時刻取得
 * 
 */
const currentTime = ():string => {
  const d = new Date()

  const hh = ('00' + d.getHours()).slice(-2)
  const mm = ('00' + d.getMinutes()).slice(-2)
  const ss = ('00' + d.getSeconds()).slice(-2)
  const sss = ('000' + d.getMilliseconds()).slice(-3)

  return `${hh}:${mm}:${ss}.${sss}`
}

/**
 * source canvas を開始する
 * 
 */
const startSourceCanvas = (props:SourceCanvasPropTypes):MediaStreamTrack => {
  const { canvas, width, height } = props

  if( canvas ) {
    // 初期値設定, 変数宣言等
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    const r = 15, d = 5
    let x = r, y = r, angle = Math.PI / 3

    const _draw = () => {
      x += Math.cos(angle) * d
      y += Math.sin(angle) * d

      // 境界を検出したら反射角に変更
      if( y < r || y > ( height - r ) ) angle *= -1
      if( x < r || x > ( width  - r ) ) angle *= ( Math.PI / Math.abs(angle) - 1 )

      // 黒で塗りつぶす
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, width, height)

      ctx.beginPath()

      // ボールを描く
      ctx.fillStyle = '#fff'
      ctx.arc( x, y, r, 0, Math.PI * 2)

      // 時刻を表示
      const curr:string = currentTime()
      ctx.textBaseline = 'top'
      ctx.font = "24px sans-serif"
      ctx.fillText( curr, r, r )
      ctx.fill()

      ctx.closePath()

      // 再描画設定
      reqId = requestAnimationFrame(_draw)
    }

    // 描画開始
    _draw()

    // 変値の Video Track オブジェクトを取得
    const stream = canvas.captureStream()
    const [ track ] = stream.getVideoTracks()

    return track
  } else {
    return null
  }
}

/**
 * JSX
 * 
 */
export default function(props:PropTypes): React.Node {
  const { title, height, width } = props
  const canvas = useRef()
  const [started, setStarted] = useState( false )

  // コンポーネントクローズ時に animation frame を止める
  useEffect(() => {
    return function cleanup() {
      if( reqId ) {
        cancelAnimationFrame( reqId )
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
    const track = startSourceCanvas({ canvas: canvas.current, width, height })
    console.log(track)
  }, [width, height])

  return (
    <div className="SourceCanvas">
      <h2>{title}</h2>
      <div>
        <button onClick={handleClick} disabled={started}>start</button>
      </div>
      <canvas ref={ elem => {
        canvas.current = elem 
      }}></canvas>
    </div>
  )
}