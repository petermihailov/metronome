import clsx from 'clsx'
import { memo } from 'react'

import { MINMAX } from '../../../../constants'
import { useMetronomeStore } from '../../../../store/useMetronomeStore'
import { ToggleableRange } from '../../../ui/ToggleableRange'

import classes from './DisplayBar.module.css'

const DisplayBar = () => {
  const {
    volume,
    setVolumeAction,
    inputLag,
    setInputLagAction,
    inputLagEnabled,
    setInputLagEnabledAction,
    mute,
    setMuteAction,
  } = useMetronomeStore(
    ({
      volume,
      setVolumeAction,
      inputLag,
      setInputLagAction,
      inputLagEnabled,
      setInputLagEnabledAction,
      mute,
      setMuteAction,
    }) => ({
      volume,
      setVolumeAction,
      inputLag,
      setInputLagAction,
      inputLagEnabled,
      setInputLagEnabledAction,
      mute,
      setMuteAction,
    }),
  )

  return (
    <div className={classes.displayBar}>
      <ToggleableRange
        enabled={inputLagEnabled}
        icon="icon.bluetooth"
        label="bluetooth input lag"
        rangeProps={{
          popover: true,
          max: MINMAX.inputLag.max,
          min: MINMAX.inputLag.min,
          value: inputLag,
          className: clsx({ [classes.disabled]: !inputLagEnabled }),
          onChange: (value) => {
            setInputLagAction(value)
          },
        }}
        onToggle={setInputLagEnabledAction}
      />

      {/* volume */}
      <ToggleableRange
        enabled={mute}
        icon="icon.volume"
        label="volume"
        rangeProps={{
          popover: true,
          value: 100 * volume,
          className: clsx({ [classes.disabled]: mute }),
          onChange: (value) => {
            setVolumeAction(0.01 * value)
          },
        }}
        onToggle={setMuteAction}
      />
    </div>
  )
}

export default memo(DisplayBar)
