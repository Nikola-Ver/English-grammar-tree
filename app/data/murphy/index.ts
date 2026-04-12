import type { Level } from '../grammar';
import { ADVANCED_DATA, ELEMENTARY_DATA, INTERMEDIATE_DATA } from './levels';

export { ADVANCED_DATA, ELEMENTARY_DATA, INTERMEDIATE_DATA } from './levels';

export const MURPHY_DATA: Level[] = [ELEMENTARY_DATA, INTERMEDIATE_DATA, ADVANCED_DATA];
