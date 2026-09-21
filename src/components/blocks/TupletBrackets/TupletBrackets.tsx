import { memo } from 'react'
import type { CSSProperties } from 'react'

import { TupletBracket } from '../../ui/TupletBracket'

import classes from './TupletBrackets.module.css'

export interface TupletBracketsProps {
  subdivisions: number[]
  style?: CSSProperties
}

const TupletBrackets = ({ subdivisions, style }: TupletBracketsProps) => {
  return (
    <div className={classes.brackets} style={style}>
      {subdivisions.map((subdivision, beat) => (
        <TupletBracket key={beat} count={subdivision} />
      ))}
    </div>
  )
}

export default memo(TupletBrackets)
