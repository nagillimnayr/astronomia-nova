import { computeVectorTable, getEphemerides, getPhysicalData } from './getEphemerides';
import { saveEphemerides, savePhysicalData } from './saveEphemerides';
import { Ephemerides } from './types/Ephemerides';

const SUN_CENTER = '500@10';
// const SOLAR_SYSTEM_BARYCENTER = '500@0';
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
  const massMap = new Map<string, number>();
  massMap.set(sunPhysicalData.name, sunPhysicalData.table.mass);

  // Planetary ephemeris data.
  for (const { id, centerId } of idSets) {
    // Fetch data from horizons.
    const rawEphemerides = await getEphemerides(id, centerId);

    // Add mass to map so orbiting bodies can retrieve it.
    massMap.set(rawEphemerides.name, rawEphemerides.physicalDataTable.mass);
    // Get mass of central body from map.
    const centralMass = massMap.get(rawEphemerides.centerName);

    // Compute missing data.
    const vectorTable = computeVectorTable(
      rawEphemerides.elementTable,
      centralMass!
    );
    const ephemerides: Ephemerides = {
      ...rawEphemerides,
      vectorTable
    }
    await saveEphemerides(ephemerides);
  }
} catch (e) {
  console.error(e);
}
