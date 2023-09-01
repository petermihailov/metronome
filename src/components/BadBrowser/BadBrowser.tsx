import clsx from 'clsx';

import classes from './BadBrowser.module.css';

export interface BadBrowserProps {
  className?: string;
}

const BadBrowser = ({ className, ...restProps }: BadBrowserProps) => {
  return (
    <div className={clsx(className, classes.root)} {...restProps}>
      <h1>Sorry, but your browser is too old</h1>
    </div>
  );
};

export default BadBrowser;
