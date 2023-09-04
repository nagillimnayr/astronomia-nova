import { useRef } from 'react';
import Body from '../Body/Body';
import { useTexture } from '@react-three/drei';
import { Orbit } from '../Orbit/Orbit';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { trpc } from '@/lib/trpc/trpc';
import KeplerBody from '@/simulation/classes/kepler-body';

export const SolarSystem = () => {
  // Load textures.
  const [
    sunTexture,
    mercuryTexture,
    venusTexture,
    earthTexture,
    moonTexture,
    marsTexture,
    jupiterTexture,
    saturnTexture,
    uranusTexture,
    neptuneTexture,
  ] = useTexture([
    'assets/textures/2k_sun.jpg',
    'assets/textures/2k_mercury.jpg',
    'assets/textures/2k_venus_atmosphere.jpg',
    'assets/textures/2k_earth_daymap.jpg',
    'assets/textures/2k_moon.jpg',
    'assets/textures/2k_mars.jpg',
    'assets/textures/2k_jupiter.jpg',
    'assets/textures/2k_saturn.jpg',
    'assets/textures/2k_uranus.jpg',
    'assets/textures/2k_neptune.jpg',
  ]);
  const rootRef = useRef<KeplerBody>(null!);

  const { keplerTreeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Load physical data for the Sun.
  const physicalDataQuery = trpc.loadPhysicalData.useQuery({ name: 'Sun' });
  if (physicalDataQuery.isError) {
    console.error(physicalDataQuery.error);
    return;
  }
  // If data hasn't loaded yet, return and wait until it has.
  if (physicalDataQuery.isLoading) return;
  if (!physicalDataQuery.data) return;

  const sunParams = physicalDataQuery.data.table;

  return (
    <Body
      ref={(root) => {
        if (!root) return;
        rootRef.current = root;
        keplerTreeActor.send({ type: 'ASSIGN_ROOT', root });
      }}
      params={{
        name: 'Sun',
        mass: sunParams.mass,
        color: 0xfdee00,
        meanRadius: sunParams.meanRadius,
        siderealRotRate: sunParams.siderealRotRate,
      }}
      texture={sunTexture}
    >
      <Orbit name={'Mercury'} texture={mercuryTexture}></Orbit>
      <Orbit name={'Venus'} texture={venusTexture}></Orbit>
      <Orbit name={'Earth'} texture={earthTexture}>
        <Orbit name={'Moon'} texture={moonTexture}></Orbit>
      </Orbit>
      <Orbit name={'Mars'} texture={marsTexture}></Orbit>
      <Orbit name={'Jupiter'} texture={jupiterTexture}></Orbit>
      <Orbit name={'Saturn'} texture={saturnTexture}></Orbit>
      <Orbit name={'Uranus'} texture={uranusTexture}></Orbit>
      <Orbit name={'Neptune'} texture={neptuneTexture}></Orbit>
    </Body>
  );
};
