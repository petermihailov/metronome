import { useEffect, useState } from 'react';

import { instruments } from '../../constants';
import type { DrumKit } from '../../types/instrument';
import { fetchAndDecodeAudio } from '../../utils/audio';

export function useDrumKit() {
  const [drumKit, setDrumKit] = useState<DrumKit | null>(null);

  useEffect(() => {
    const buffers: DrumKit = {} as DrumKit;

    const instrumentPromises = instruments.map(async (instrument) => {
      buffers[instrument] = await fetchAndDecodeAudio(`sounds/${instrument}.mp3`);
    });

    Promise.all(instrumentPromises).then(() => {
      setDrumKit(buffers);
    });
  }, []);

  return drumKit;
}
