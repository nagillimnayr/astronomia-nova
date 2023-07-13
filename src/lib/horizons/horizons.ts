import { getEphemerides } from './getEphemerides';

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
      ephemerides;
      console.log('elements:', ephemerides.elements);
      console.log('vectors:', ephemerides.vectors);
    } catch (e) {
      console.error(e);
    }
  }
} else {
  console.log('not enough arguments');
}
