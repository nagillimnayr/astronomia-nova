import type { BodyKey } from './BodyKey';

// unique body codes are necessary to differentiate from the respective bodies' barycenters in the Horizons system
const bodyCodes: ReadonlyMap<BodyKey, string> = new Map<BodyKey, string>([
  ['Sun', ''],
  ['Mercury', ''],
  ['Venus', ''],
  ['Earth', '399'],
  ['Moon', '301'],
  ['Mars', '499'],
  ['Jupiter', ''],
  ['Saturn', ''],
  ['Uranus', ''],
  ['Neptune', ''],
  ['Pluto', ''],
]);
