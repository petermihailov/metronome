import { SpringPhysics } from '../../lib/SpringPhysics';
import { animateFromTo } from '../../utils/animation/animate-from-to';

const target = 200;
const namespace = '--prompt-translate-y';

export const animationIn = (element: HTMLElement) => {
  const from = target;
  const to = 0;

  element.style.transform = `translateY(var(${namespace}, ${from}%))`;
  element.style.opacity = '1';

  return new Promise((onFinish) => {
    const physics = new SpringPhysics({
      from,
      to,
      options: { namespace },
      onFinish,
      onUpdate: ({ namespace, value }) => {
        element.style.setProperty(namespace, value + '%');
      },
    });

    physics.go();
  });
};

export const animationOut = (element: HTMLElement) => {
  const from = 0;
  const to = target;

  element.style.transform = `translateY(var(${namespace}, ${from}%))`;
  element.style.opacity = '1';

  return animateFromTo(
    100,
    (value) => {
      element.style.setProperty(namespace, value + '%');
    },
    { from, to },
  );
};
