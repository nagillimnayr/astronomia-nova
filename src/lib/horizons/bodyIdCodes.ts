import type { BodyKey } from './BodyKey';

// unique body codes are necessary to differentiate from the respective bodies' barycenters in the Horizons system
const bodyCodes: ReadonlyMap<BodyKey, string> = new Map<BodyKey, string>([
  ['Sun', '10'],
  ['Mercury', '199'],
  ['Venus', '299'],

  ['Earth', '399'],
  ['Moon', '301'],

  // Martian system
  ['Mars', '499'],

  // Jovian system
  ['Jupiter', '599'],
  ['Io', '501'],
  ['Europa', '502'],
  ['Ganymede', '503'],
  ['Callisto', '504'],

  // Saturnian system
  ['Saturn', '699'],

  // Uranian system
  ['Uranus', '799'],

  // Neptunian system
  ['Neptune', '899'],

  ['Pluto', '999'],
]);

export default bodyCodes;
