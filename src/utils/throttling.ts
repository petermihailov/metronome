/* eslint-disable @typescript-eslint/no-explicit-any */

interface Cancel {
  cancel: () => void;
}

interface NoReturn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
}

export type Throttle<T extends (...args: any[]) => any> = NoReturn<T> & Cancel;
export type Debounce<T extends (...args: any[]) => any> = Throttle<T>;

type ThrottleOptions = Partial<{
  noTrailing: boolean;
  noLeading: boolean;
  debounceMode: boolean;
}>;

export function throttle<T extends (...args: any[]) => any>(
  delay: number,
  callback: T,
  options?: ThrottleOptions,
): Throttle<T> {
  const { noTrailing = false, noLeading = false, debounceMode = undefined } = options || {};

  let timeoutId: number | undefined;
  let cancelled = false;

  let lastExec = 0;

  function clearExistingTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  }

  const wrapper = (...args: Parameters<T>) => {
    const elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    }

    function exec() {
      lastExec = Date.now();
      callback(args);
    }

    function clear() {
      timeoutId = undefined;
    }

    if (!noLeading && debounceMode && !timeoutId) {
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        lastExec = Date.now();
        if (!noTrailing) {
          timeoutId = window.setTimeout(debounceMode ? clear : exec, delay);
        }
      } else {
        exec();
      }
    } else if (!noTrailing) {
      timeoutId = window.setTimeout(
        debounceMode ? clear : exec,
        debounceMode === undefined ? delay - elapsed : delay,
      );
    }
  };

  wrapper.cancel = cancel;

  return wrapper;
}

export function debounce<T extends (...args: any[]) => any>(
  delay: number,
  callback: T,
): Debounce<T> {
  return throttle(delay, callback, { debounceMode: true });
}
