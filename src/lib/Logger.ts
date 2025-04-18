/* eslint-disable @typescript-eslint/no-explicit-any */

import { Storage } from './LocalStorage'
import { dateFormat } from '../utils/format'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogFn = (title: string, ...args: any[]) => void

export type Logger = Record<LogLevel, LogFn> & { on: () => void; off: () => void }

interface LoggerOptions {
  color?: string
}

window.logs = {}
const loggerStorage = new Storage<{ [namespace: string]: LogLevel[] }>('logger', {})

const emoji: Record<LogLevel, string> = {
  info: '',
  debug: '_',
  warn: '⚠️',
  error: '❌',
}

declare const APP_VERSION: string
declare const APP_BUILD_TIME: string

console.log(
  `%cMetronome  🥁%c\nversion: ${APP_VERSION}\nrelease date: ${dateFormat(new Date(Number(APP_BUILD_TIME)))}`,
  'color:#f07; background:#012; font-size:1.5rem; padding:0.5rem 0.5rem 0rem; margin: 1rem auto; font-family: Rockwell; border: 0.1rem solid #0ef; border-radius: 0.5rem;font-weight: bold; text-shadow: 2px 2px 0 #000;',
  '',
)

export const createLogger = (namespace: string, { color }: LoggerOptions): Logger => {
  if (loggerStorage.get()[namespace] === undefined) {
    loggerStorage.update({ [namespace]: ['error'] })
  }

  const log = (level: LogLevel, logNamespace: string, title: string, ...args: any[]) => {
    const enabled = loggerStorage.get()[namespace] || []
    if (!enabled.includes(level)) return

    console.log(title)

    if (args.length === 1 && typeof args[0] !== 'object') {
      const label = `${emoji[level]}[%c${logNamespace.toUpperCase()}%c]:${title} = %c${args[0]}`
      console.log(
        label,
        `font-weight:bold;${color ? 'color:' + color : ''}`,
        '',
        `font-weight:bold;${color ? 'color:' + color : ''}`,
      )
    } else {
      const label = `${emoji[level]}[%c${logNamespace.toUpperCase()}%c]:${title}`
      console.log(label, `font-weight:bold;${color ? 'color:' + color : ''}`, '', ...args)
    }
  }

  window.logs[namespace] = {
    debug: log.bind(null, 'debug', namespace),
    info: log.bind(null, 'info', namespace),
    warn: log.bind(null, 'warn', namespace),
    error: log.bind(null, 'error', namespace),
    on: (...levels: LogLevel[]) => {
      loggerStorage.update({
        [namespace]: levels.length ? levels : ['info', 'debug', 'warn', 'error'],
      })
    },
    off: () => {
      loggerStorage.update({ [namespace]: [] })
    },
  }

  return window.logs[namespace]
}
