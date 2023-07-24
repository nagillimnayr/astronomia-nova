import { getEphemerides } from './getEphemerides';
import { saveEphemerides } from './saveEphemerides';

const idSets = [
  { id: '199', centerId: '500@10' },
  { id: '299', centerId: '500@10' },
  { id: '399', centerId: '500@10' },
  { id: '301', centerId: '500@399' },
  { id: '499', centerId: '500@10' },
  { id: '599', centerId: '500@10' },
  { id: '699', centerId: '500@10' },
  { id: '799', centerId: '500@10' },
  { id: '899', centerId: '500@10' },
];

if (process.argv.length >= 3) {
  const id = process.argv[2];
  // const outputFile = process.argv[3];

  if (id) {
    try {
      const ephemerides = await getEphemerides(id);
      await saveEphemerides(ephemerides);
      console.log('elements:', ephemerides.elements);
      console.log('vectors:', ephemerides.vectors);
      console.log('physical data:', ephemerides.physicalData);
    } catch (e) {
      console.error(e);
    }
  }
} else {
  // console.log('not enough arguments');
  for (const { id, centerId } of idSets) {
    const ephemerides = await getEphemerides(id, centerId);
    await saveEphemerides(ephemerides);
  }
}
