import { memo, useEffect, useState } from 'react';

import env from '../../env';

import classes from './Version.module.css';

const Version = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    if (!env.DEV) {
      fetch('/version')
        .then((res) => res.text())
        .then((v) => setVersion('v' + v.trim()));
    } else {
      setVersion('v' + APP_VERSION);
    }
  }, []);

  return <div className={classes.root}>{version}</div>;
};

export default memo(Version);
