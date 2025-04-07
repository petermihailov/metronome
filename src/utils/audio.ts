const audioCtx = new AudioContext({ latencyHint: 'interactive' })

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    throw new Error('AudioContext not implemented')
  }

  return audioCtx
}

export async function fetchAndDecodeAudio(url: string) {
  const audioCtx = getAudioContext()
  const response = await fetch(url)
  const responseBuffer = await response.arrayBuffer()

  return new Promise<AudioBuffer>((resolve, reject) => {
    audioCtx.decodeAudioData(
      responseBuffer,
      (buffer) => {
        resolve(buffer)
      },
      (e) => {
        console.log(e)
        reject(e)
      },
    )
  })
}
