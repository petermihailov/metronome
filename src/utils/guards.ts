import { instruments } from '../constants';
import type { Instrument } from '../types/instrument';

export const isInstrument = (str = ''): str is Instrument => {
  return instruments.includes(str as Instrument);
};
