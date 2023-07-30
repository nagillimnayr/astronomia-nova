import { getEphemerides, getPhysicalData } from './getEphemerides';
import { saveEphemerides, savePhysicalData } from './saveEphemerides';

const SUN_CENTER = '500@10';
const SOLAR_SYSTEM_BARYCENTER = '500@0';
const DEFAULT_CENTER = SUN_CENTER;

const idSets = [
  { id: '199', centerId: DEFAULT_CENTER },
  { id: '299', centerId: DEFAULT_CENTER },
  { id: '399', centerId: DEFAULT_CENTER },
  { id: '301', centerId: '500@399' },
  { id: '499', centerId: DEFAULT_CENTER },
  { id: '599', centerId: DEFAULT_CENTER },
  { id: '699', centerId: DEFAULT_CENTER },
  { id: '799', centerId: DEFAULT_CENTER },
  { id: '899', centerId: DEFAULT_CENTER },
];

// if (process.argv.length >= 3) {
//   const id = process.argv[2];
//   // const outputFile = process.argv[3];

//   if (id) {
//     try {
//       const ephemerides = await getEphemerides(id);
//       await saveEphemerides(ephemerides);
//       console.log('elements:', ephemerides.elements);
//       console.log('vectors:', ephemerides.vectors);
//       console.log('physical data:', ephemerides.physicalData);
//     } catch (e) {
//       console.error(e);
//     }
//   }
// } else {
//   try {
//     for (const { id, centerId } of idSets) {
//       const ephemerides = await getEphemerides(id, centerId);
//       await saveEphemerides(ephemerides);
//     }
//     // Sun physical data
//     const physicalData = await getPhysicalData('10', '500@0');
//     await savePhysicalData(physicalData);
//   } catch (e) {
//     console.error(e);
//   }
// }

try {
  // Sun physical data
  const physicalData = await getPhysicalData('10', '500@0');
  await savePhysicalData(physicalData);
  for (const { id, centerId } of idSets) {
    const ephemerides = await getEphemerides(id, centerId);
    await saveEphemerides(ephemerides);
  }
} catch (e) {
  console.error(e);
}
