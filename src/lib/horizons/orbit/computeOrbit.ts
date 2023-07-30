import {
  loadEphemerides,
  loadEphemeris,
  loadPhysicalData,
} from '../loadEphemerides';

export async function computeOrbit(name: string) {
  // Load ephemeris data.
  const elements = await loadEphemeris(name, 'ELEMENTS');
  const physicalData = await loadPhysicalData(name);
}
