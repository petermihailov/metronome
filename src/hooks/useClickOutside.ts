import type { RefObject } from 'react';
import { useEffect } from 'react';

export function useClickOutside(
  ref: Array<RefObject<HTMLElement>> | RefObject<HTMLElement>,
  handler?: (e: MouseEvent) => void,
) {
  useEffect(() => {
    const refs = !Array.isArray(ref) ? [ref] : ref;

    const listener = (e: MouseEvent) => {
      const { target } = e;
      if (target instanceof Element && refs.some((r) => r.current?.contains(target))) {
        return;
      }
      handler?.(e);
    };

    document.addEventListener('click', listener);
    return () => {
      document.removeEventListener('click', listener);
    };
  }, [ref, handler]);
}
