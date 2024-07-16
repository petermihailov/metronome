export type EasingFunction = (t: number) => number;
export type OnFrameCallback = (t: number) => void;

export const easeOutQuint: EasingFunction = (t) => 1 - Math.pow(1 - t, 5);

export interface AnimateOptions {
  from: number;
  to: number;
  easing: EasingFunction;
}

const defaultOptions: AnimateOptions = {
  from: 0,
  to: 1,
  easing: (t) => t,
};

export const animateFromTo = (
  duration: number,
  onFrame: OnFrameCallback,
  options?: Partial<AnimateOptions>,
) => {
  const { from, to, easing } = { ...defaultOptions, ...options };

  return new Promise<void>((resolve) => {
    let start = 0,
      end = 0;

    const loop = (time: number) => {
      if (!loop || !end) {
        start = time;
        end = time + duration;
        onFrame(from);
        window.requestAnimationFrame(loop);
      } else {
        if (time <= end) {
          const value = from + (to - from) * easing((time - start) / (end - start));
          onFrame(value);
          window.requestAnimationFrame(loop);
        } else {
          onFrame(to);
          resolve();
        }
      }
    };

    window.requestAnimationFrame(loop);
  });
};
