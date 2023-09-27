import { useEffect, useRef, useState } from 'react';

import { StorageField } from '../lib/LocalStorage';
import { dateFormat, timeFormat } from '../utils/format';

const defaults = {
  current: 0,
  session: 0,
  day: 0,
};

const currentDate = dateFormat();
const trainingStorageField = new StorageField<{ [date: string]: number }>('training');
const storageValue = trainingStorageField.get();

if (!storageValue) {
  trainingStorageField.set({ [currentDate]: 0 });
} else {
  if (storageValue[currentDate]) {
    defaults.day = storageValue[currentDate];
  }
}

export const useTrainingTime = (isPlaying: boolean) => {
  const [elapsed, setElapsed] = useState(defaults);
  const refInterval = useRef<number>();

  useEffect(() => {
    const callback = () => {
      setElapsed((prev) => {
        const current = prev.current + 1;
        const session = prev.session + 1;
        const day = prev.day + 1;

        trainingStorageField.merge({ [currentDate]: day });
        return { current, session, day };
      });
    };

    if (isPlaying) {
      setElapsed((prev) => ({ ...prev, current: 0 }));
      refInterval.current = window.setInterval(callback, 1000);
    }

    return () => {
      window.clearInterval(refInterval.current);
    };
  }, [isPlaying]);

  return {
    current: timeFormat(elapsed.current),
    session: timeFormat(elapsed.session),
    day: timeFormat(elapsed.day),
  };
};
