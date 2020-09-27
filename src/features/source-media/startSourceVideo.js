// @flow

type PropTypes = {
  canvas: HTMLVideoElement;
  width: number;
  height: number;
}

/**
 * source video を開始する
 * 
 */
export default function startSourceVideo(props:PropTypes):Promise<MediaStream> {
  return new Promise( (resolve, reject) => {
    const { video, width, height } = props

    if( video ) {
      video.width = width
      video.height = height

      // Video stream オブジェクトを取得
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then( stream => {
          resolve( stream )
        }).catch( reject )
    } else {
      reject( new TypeError("canvas is null"))
    }
  })
}
