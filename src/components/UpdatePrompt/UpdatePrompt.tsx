import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';

import { animationIn, animationOut } from './animations';
import background from './blur-bg.png';
import { ButtonIcon } from '../ButtonIcon';
import { Icon } from '../Icon';

import classes from './UpdatePrompt.module.css';

export interface UpdatePromptProps {
  className?: string;
}

const UpdatePrompt = ({ className, ...restProps }: UpdatePromptProps) => {
  const promptRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isAnimation, setIsAnimation] = useState(false);
  const [prompt, setPrompt] = useState<'update' | 'ready'>('update');

  const updateSwRef = useRef<ReturnType<typeof registerSW>>();

  useEffect(() => {
    updateSwRef.current = registerSW({
      onNeedRefresh() {
        setPrompt('update');
        setIsMounted(true);
      },
      onOfflineReady() {
        setPrompt('ready');
        setIsMounted(true);
      },
    });
  }, []);

  useLayoutEffect(() => {
    setIsAnimation(true);

    if (promptRef.current) {
      if (isMounted) {
        animationIn(promptRef.current).finally(() => {
          setIsAnimation(false);
        });
      } else {
        animationOut(promptRef.current).finally(() => {
          setIsAnimation(false);
        });
      }
    }
  }, [isMounted]);

  if (isMounted || isAnimation) {
    return (
      <div
        className={clsx(className, classes.root, {
          [classes.updatePrompt]: prompt === 'update',
          [classes.readyPrompt]: prompt === 'ready',
        })}
        {...restProps}
      >
        <div
          ref={promptRef}
          className={classes.prompt}
          style={{
            backgroundImage: `url(${background})`,
            backgroundPosition: prompt === 'update' ? 'center' : 'bottom',
          }}
        >
          <div className={classes.titleWrapper}>
            <Icon className={classes.icon} name={prompt === 'update' ? 'icon.box' : 'icon.done'} />
            <h1 className={classes.title}>
              {prompt === 'update' && 'New version available!'}
              {prompt === 'ready' && 'Thanks for updating! ❤️'}
            </h1>
            <ButtonIcon
              aria-label="close"
              className={classes.closeButton}
              color="accent2"
              icon="icon.close"
              onClick={() => setIsMounted(false)}
            />
          </div>

          {prompt === 'update' && (
            <div className={classes.actions}>
              <button className={classes.skip} onClick={() => setIsMounted(false)}>
                skip this version
              </button>
              <span>or</span>
              <button className={classes.update} onClick={() => updateSwRef.current?.()}>
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
