import { loadEphemerides } from '../loadEphemerides';

export async function computeOrbit(name: string, centralBodyName: string) {
  // Load ephemeris data.
  const ephemerides = await loadEphemerides(name);
}
