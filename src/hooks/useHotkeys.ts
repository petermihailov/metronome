import { useEffect, useRef, useMemo } from 'react'

type HotkeyCallback = (event: KeyboardEvent) => void
export type HotkeysMap = Record<string, HotkeyCallback>

interface ParsedHotkey {
  code: string
  ctrl: boolean
  shift: boolean
  alt: boolean
  meta: boolean
  callback: HotkeyCallback
  modifiersCount: number
}

/**
 * useHotkeys принимает объект вида:
 * {
 *   "ArrowUp":             () => …,
 *   "shift+ArrowUp":       () => …,
 *   "alt+shift+KeyT":      () => …,
 * }
 */
export function useHotkeys(hotkeys: HotkeysMap) {
  // разобранные комбинации
  const parsed = useMemo<ParsedHotkey[]>(() => {
    const list: ParsedHotkey[] = []

    for (const [combo, callback] of Object.entries(hotkeys)) {
      const parts = combo.toLowerCase().split('+')
      const ctrl = parts.includes('ctrl')
      const shift = parts.includes('shift')
      const alt = parts.includes('alt')
      const meta = parts.includes('meta')
      // код клавиши — та часть, что не модификатор
      const codePart = parts.find((p) => !['ctrl', 'shift', 'alt', 'meta'].includes(p))
      if (!codePart) continue

      list.push({
        code: codePart,
        ctrl,
        shift,
        alt,
        meta,
        callback,
        modifiersCount: [ctrl, shift, alt, meta].filter(Boolean).length,
      })
    }

    // сперва самые «конкретные» (с большим числом модификаторов)
    list.sort((a, b) => b.modifiersCount - a.modifiersCount)
    return list
  }, [hotkeys])

  // держим в рефе, чтобы не пересоздавать handler
  const parsedRef = useRef<ParsedHotkey[]>(parsed)
  useEffect(() => {
    parsedRef.current = parsed
  }, [parsed])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      for (const { code, ctrl, shift, alt, meta, callback } of parsedRef.current) {
        if (
          event.code.toLowerCase() === code &&
          event.ctrlKey === ctrl &&
          event.shiftKey === shift &&
          event.altKey === alt &&
          event.metaKey === meta
        ) {
          event.preventDefault()
          callback(event)
          break // больше ничего не дергаем
        }
      }
    }

    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [])
}
