import { memo, useCallback, useEffect, useState } from 'react';

import { share } from '../../utils/share';
import type { ButtonIconProps } from '../ButtonIcon';
import { ButtonIcon } from '../ButtonIcon';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

import classes from './ButtonShare.module.css';

export type ButtonShareProps = Omit<ButtonIconProps, 'aria-label'>;

const hasShareAPI = 'share' in navigator;

const ButtonShare = (props: ButtonShareProps) => {
  const [tooltipText, setTooltipText] = useState('');
  const iconName = hasShareAPI ? 'icon.share' : 'icon.link';

  const shareHandler = useCallback(() => {
    share().then((type) => {
      setTooltipText(type + '! 👍');
    });
  }, []);

  useEffect(() => {
    let timeout: number;

    if (tooltipText) {
      window.setTimeout(() => {
        setTooltipText('');
      }, 1200);
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [tooltipText]);

  return (
    <ButtonIcon aria-label="copy link" onClick={shareHandler} {...props}>
      <Tooltip className={classes.tooltip} placement="top">
        {tooltipText}
      </Tooltip>
      <Icon name={iconName} />
    </ButtonIcon>
  );
};

export default memo(ButtonShare);
