import { memo } from 'react'

import { MINMAX } from '../../../constants'
import { isTuplet, tupletName } from '../../../utils/barLayout'

import classes from './TupletBracket.module.css'

export interface TupletBracketProps {
  // Номер доли, над которой стоит скобка
  beat: number
  // Сколько нот в доле
  count: number
  onChange: (beat: number, subdivision: number) => void
}

// Скобка над долей: линия с засечками по краям и цифрой по центру.
// Левая половина уменьшает subdivision доли, правая — увеличивает.
const TupletBracket = ({ beat, count, onChange }: TupletBracketProps) => {
  return (
    <div className={classes.bracket} title={isTuplet(count) ? tupletName(count) : undefined}>
      <button
        aria-label="decrease subdivision"
        className={classes.button}
        disabled={count <= MINMAX.subdivision.min}
        type="button"
        onClick={() => onChange(beat, count - 1)}
      >
        −
      </button>
      <span className={classes.count}>{count}</span>
      <button
        aria-label="increase subdivision"
        className={classes.button}
        disabled={count >= MINMAX.subdivision.max}
        type="button"
        onClick={() => onChange(beat, count + 1)}
      >
        +
      </button>
    </div>
  )
}

export default memo(TupletBracket)
