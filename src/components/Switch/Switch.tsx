import { useState } from 'react';

import classes from './Switch.module.css';

const Switch = () => {
  const [value, setValue] = useState(false);

  return (
    <div
      className={classes.switch}
      onClick={() => {
        setValue((prev) => !prev);
      }}
    >
      {value ? 'on' : 'off'}
    </div>
  );
};

export default Switch;
