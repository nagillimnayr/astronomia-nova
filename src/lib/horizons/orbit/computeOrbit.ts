import { loadEphemerides } from '../loadEphemerides';

export async function computeOrbit(name: string, centralBodyName: string) {
  const ephemerides = await loadEphemerides(name);
}
