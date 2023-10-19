import clsx from 'clsx';
import { useLayoutEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react';

import { animationIn, animationOut } from './animations';
import background from './blur-bg.png';
import { ButtonIcon } from '../ButtonIcon';
import { Icon } from '../Icon';

import classes from './UpdatePrompt.module.css';

const UpdatePrompt = () => {
  const promptRef = useRef<HTMLDivElement>(null);
  const [isAnimation, setIsAnimation] = useState(false);

  const {
    needRefresh: [isVisibleUpdate, setIsVisibleUpdate],
    offlineReady: [isVisibleReady, setIsVisibleReady],
    updateServiceWorker,
  } = useRegisterSW();

  useLayoutEffect(() => {
    setIsAnimation(true);

    if (promptRef.current) {
      if (isVisibleUpdate || isVisibleReady) {
        animationIn(promptRef.current).finally(() => {
          setIsAnimation(false);
        });
      } else {
        animationOut(promptRef.current).finally(() => {
          setIsAnimation(false);
        });
      }
    }
  }, [isVisibleUpdate, isVisibleReady, setIsVisibleReady, setIsVisibleUpdate]);

  const close = () => {
    setIsVisibleReady(false);
    setIsVisibleUpdate(false);
  };

  if (isVisibleUpdate || isVisibleReady || isAnimation) {
    return (
      <div
        className={clsx(classes.root, {
          [classes.updatePrompt]: isVisibleUpdate,
          [classes.readyPrompt]: isVisibleReady,
        })}
      >
        <div
          ref={promptRef}
          className={classes.prompt}
          style={{
            backgroundImage: `url(${background})`,
            backgroundPosition: isVisibleUpdate ? 'center' : 'bottom',
          }}
        >
          <div className={classes.titleWrapper}>
            <Icon className={classes.icon} name={isVisibleUpdate ? 'icon.box' : 'icon.done'} />
            <h1 className={classes.title}>
              {isVisibleUpdate && 'New version available!'}
              {isVisibleReady && 'Thank you for install! ❤️'}
            </h1>
            <ButtonIcon
              aria-label="close"
              className={classes.closeButton}
              color="accent2"
              icon="icon.close"
              onClick={close}
            />
          </div>

          {isVisibleUpdate && (
            <div className={classes.actions}>
              <button className={classes.skip} type="button" onClick={close}>
                skip this version
              </button>
              <span>or</span>
              <button
                className={classes.update}
                type="button"
                onClick={() => updateServiceWorker()}
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default UpdatePrompt;
