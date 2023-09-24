import { memo, useEffect, useState } from 'react';

import classes from './Version.module.css';

const Version = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    fetch('/public/version')
      .then((res) => res.text())
      .then((v) => setVersion('v' + v.trim()));
  }, []);

  return <div className={classes.root}>{version}</div>;
};

export default memo(Version);
