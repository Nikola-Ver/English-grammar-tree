import type { Level } from './grammar';
import { ADVANCED_DATA } from './murphy-advanced';
import { ELEMENTARY_DATA } from './murphy-elementary';
import { INTERMEDIATE_DATA } from './murphy-intermediate';

export const MURPHY_DATA: Level[] = [ELEMENTARY_DATA, INTERMEDIATE_DATA, ADVANCED_DATA];
