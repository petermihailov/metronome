import { memo } from 'react'

import classes from './BadBrowser.module.css'

const BadBrowser = () => {
  return (
    <div className={classes.badBrowser}>
      <h1>Sorry, but your browser is too old</h1>
    </div>
  )
}

export default memo(BadBrowser)
