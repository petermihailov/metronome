import type { MouseEvent } from 'react';

export type MouseEventHandler<T extends HTMLElement | SVGSVGElement> = (
  event: MouseEvent<T> & { target: T },
) => void;
