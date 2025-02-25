const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const hasOutputLatency = 'outputLatency' in audioCtx

export function getAudioContext(): AudioContext {
  return audioCtx
}

export function getOutputLatency() {
  if (hasOutputLatency) {
    return audioCtx.outputLatency // seconds
  }

  return 0
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
