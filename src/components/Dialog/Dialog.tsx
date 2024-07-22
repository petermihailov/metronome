import clsx from 'clsx';
import type { DialogHTMLAttributes, MouseEventHandler } from 'react';
import { memo, forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import classes from './Dialog.module.css';

export interface DialogHandlers {
  show: () => void;
  showModal: () => void;
  close: () => void;
}

export interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  mode: 'mega' | 'mini';
}

const Dialog = forwardRef<DialogHandlers, DialogProps>(function Dialog(props, ref) {
  const { className, mode = 'mega', ...restProps } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const lightDismiss: MouseEventHandler<HTMLDialogElement> = useCallback(({ target }) => {
    if (target === dialogRef.current) {
      dialogRef.current?.close('dismiss');
    }
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        show: () => dialogRef.current?.show(),
        showModal: () => dialogRef.current?.showModal(),
        close: () => dialogRef.current?.close(),
      };
    },
    [],
  );

  // ToDo: при открытии модалки установить аттрибут inert у react-root элемента: <div inert>
  //  это a11y фича. inert выключит взаимодействие с клавой и мышью, и фокус останется внутри модалки

  return (
    <dialog
      ref={dialogRef}
      className={clsx(className, classes.dialog)}
      data-mode={mode}
      onClick={lightDismiss}
      {...restProps}
    />
  );
});

export default memo(Dialog);
