import type { RuContrast } from '../types';
import { CONTRAST_A1B1 } from './a1b1';
import { CONTRAST_B2C2 } from './b2c2';

/** «Почему по-русски иначе» notes by grammar rule id (loaded lazily by the rule cards). */
export const RU_CONTRAST: Record<string, RuContrast> = { ...CONTRAST_A1B1, ...CONTRAST_B2C2 };
