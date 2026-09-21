import { memo } from 'react'
import type { CSSProperties } from 'react'

import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { TupletBracket } from '../../ui/TupletBracket'

import classes from './TupletBrackets.module.css'

export interface TupletBracketsProps {
  subdivisions: number[]
  style?: CSSProperties
}

const TupletBrackets = ({ subdivisions, style }: TupletBracketsProps) => {
  const setBeatSubdivisionAction = useMetronomeStore(
    ({ setBeatSubdivisionAction }) => setBeatSubdivisionAction,
  )

  return (
    <div className={classes.brackets} style={style}>
      {subdivisions.map((subdivision, beat) => (
        <TupletBracket
          key={beat}
          beat={beat}
          count={subdivision}
          onChange={setBeatSubdivisionAction}
        />
      ))}
    </div>
  )
}

export default memo(TupletBrackets)
