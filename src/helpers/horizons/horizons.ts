import {
  computeEphemerides,
  computePhysicalData,
} from '@/helpers/horizons/compute/computeEphemerides';
import {
  saveComputedEphemerides,
  saveComputedPhysicalData,
} from '@/helpers/horizons/compute/saveComputed';
import { getEphemerides, getPhysicalData } from './getEphemerides';
import { saveEphemerides, savePhysicalData } from './saveEphemerides';

const SUN_CENTER = '500@10';
const SOLAR_SYSTEM_BARYCENTER = '500@0';
const DEFAULT_CENTER = SUN_CENTER;

const idSets = [
  { name: 'Mercury', id: '199', centerId: DEFAULT_CENTER },
  { name: 'Venus', id: '299', centerId: DEFAULT_CENTER },
  { name: 'Earth', id: '399', centerId: DEFAULT_CENTER },
  { name: 'Moon', id: '301', centerId: '500@399' },
  { name: 'Mars', id: '499', centerId: DEFAULT_CENTER },
  { name: 'Jupiter', id: '599', centerId: DEFAULT_CENTER },
  { name: 'Saturn', id: '699', centerId: DEFAULT_CENTER },
  { name: 'Uranus', id: '799', centerId: DEFAULT_CENTER },
  { name: 'Neptune', id: '899', centerId: DEFAULT_CENTER },
];

try {
  // Sun physical data.
  const sunPhysicalData = await getPhysicalData('10', '500@0');
  await savePhysicalData(sunPhysicalData);
  const sunComputedPhysicalData = await computePhysicalData('Sun');
  await saveComputedPhysicalData(sunComputedPhysicalData);

  // Planetary ephemeris data.
  for (const { id, centerId } of idSets) {
    const ephemerides = await getEphemerides(id, centerId);
    await saveEphemerides(ephemerides);
  }

  // Computed ephemeris data.
  for (const { name } of idSets) {
    const computedEphemerides = await computeEphemerides(name);
    await saveComputedEphemerides(computedEphemerides);
    const computedPhysicalData = await computePhysicalData(name);
    await saveComputedPhysicalData(computedPhysicalData);
  }
} catch (e) {
  console.error(e);
}
