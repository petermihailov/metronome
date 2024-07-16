import { useEffect } from 'react';

export const useButtonsPreventSpacePress = () => {
  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'BUTTON' && event.code === 'Space') {
        event.preventDefault();
      }
    };

    document.addEventListener('keyup', callback);
    return () => {
      document.removeEventListener('keyup', callback);
    };
  }, []);
};
