import { getEphemerides } from './getEphemerides';
import { saveEphemerides } from './saveEphemerides';

async function horizons(code: string) {
  const ephemerides = await getEphemerides(code);
  return ephemerides;
}

if (process.argv.length >= 3) {
  const code = process.argv[2];
  // const outputFile = process.argv[3];

  if (code) {
    try {
      const ephemerides = await horizons(code);
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
  for (let i = 1; i <= 8; i++) {
    const code = `${99 + i * 100}`;
    const ephemerides = await horizons(code);
    await saveEphemerides(ephemerides);
  }
}
