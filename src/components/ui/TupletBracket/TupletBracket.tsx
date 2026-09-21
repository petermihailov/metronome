import { memo } from 'react'

import { isTuplet, tupletName } from '../../../utils/barLayout'

import classes from './TupletBracket.module.css'

export interface TupletBracketProps {
  // Сколько нот охватывает скобка
  count: number
}

// Скобка tuplet: линия сверху с засечками вниз по краям и цифрой по центру
const TupletBracket = ({ count }: TupletBracketProps) => {
  return (
    <div className={classes.bracket} title={isTuplet(count) ? tupletName(count) : undefined}>
      <span className={classes.line} />
      <span className={classes.count}>{count}</span>
      <span className={classes.line} />
    </div>
  )
}

export default memo(TupletBracket)
