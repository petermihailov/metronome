import { createLogger } from '../lib/Logger'

const logger = createLogger('AUDIO', { color: '#2af' })

// После перехода контекста в running устройство вывода (особенно Bluetooth) открывается
// ещё 100–500 мс, и звук в это окно теряется. Столько мс после пробуждения считаем контекст «холодным»
const warmupMs = 1000

const audioCtx = new AudioContext({ latencyHint: 'interactive' })

// Когда контекст в последний раз перешёл в running. При загрузке он обычно suspended,
// но в Chrome со sticky activation может быть уже running — тогда отсчёт идёт с загрузки
let runningSince = audioCtx.state === 'running' ? Date.now() : -Infinity

// Отдельной функцией: после await TS не видит, что state мог измениться, и сужает тип
const isRunning = () => audioCtx.state === 'running'

audioCtx.addEventListener('statechange', () => {
  logger.info('statechange', audioCtx.state)

  if (isRunning()) {
    runningSince = Date.now()
  }
})

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    throw new Error('AudioContext not implemented')
  }

  return audioCtx
}

// Будит контекст, если он не running: не только suspended, но и interrupted в Safari
// после звонка или другого приложения
export async function resumeAudioContext() {
  if (isRunning()) return

  await audioCtx.resume()
  logger.info('resume', audioCtx.state)

  // statechange приходит отдельной задачей уже после резолва промиса, поэтому отмечаем сами.
  // Но только если контекст действительно пошёл: в Safari из interrupted он может и не выйти
  if (isRunning()) {
    runningSince = Date.now()
  }
}

// Контекст проснулся меньше warmupMs назад — первой ноте нужен запас больше обычного
export function isAudioWarmingUp(): boolean {
  return Date.now() - runningSince < warmupMs
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
