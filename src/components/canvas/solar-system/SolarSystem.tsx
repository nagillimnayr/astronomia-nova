import KeplerBody from '@/components/canvas/body/kepler-body';
import { trpc } from '@/helpers/trpc/trpc';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import { Body } from '../body';
import { Orbit } from '../orbit/Orbit';
import { colorMap } from '@/helpers/color-map';

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

  // Load data.
  const [data, dataQuery] = trpc.loadAllComputedData.useSuspenseQuery();

  const rootRef = useRef<KeplerBody>(null!);

  const { keplerTreeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  if (dataQuery.isError) {
    console.error(dataQuery.error);
    return;
  }
  // If data hasn't loaded yet, return and wait until it has.
  if (dataQuery.isLoading) return;
  if (!dataQuery.data) return;

  const sunParams = data.sun.table;
  const sunColor = colorMap.get('Sun');

  return (
    <Body
      ref={(root) => {
        if (!root) return;
        if (rootRef.current === root) return;
        rootRef.current = root;
        keplerTreeActor.send({ type: 'ASSIGN_ROOT', root });
      }}
      name={'Sun'}
      mass={sunParams.mass}
      color={sunColor ?? 'white'}
      meanRadius={sunParams.meanRadius}
      siderealRotationRate={sunParams.siderealRotRate}
      siderealRotationPeriod={sunParams.siderealRotationPeriod}
      texture={sunTexture}
    >
      <Orbit
        name={'Mercury'}
        texture={mercuryTexture}
        ephemerides={data.mercury}
      ></Orbit>
      <Orbit
        name={'Venus'}
        texture={venusTexture}
        ephemerides={data.venus}
      ></Orbit>
      <Orbit name={'Earth'} texture={earthTexture} ephemerides={data.earth}>
        <Orbit
          name={'Moon'}
          texture={moonTexture}
          ephemerides={data.moon}
        ></Orbit>
      </Orbit>
      <Orbit
        name={'Mars'}
        texture={marsTexture}
        ephemerides={data.mars}
      ></Orbit>
      <Orbit
        name={'Jupiter'}
        texture={jupiterTexture}
        ephemerides={data.jupiter}
      ></Orbit>
      <Orbit
        name={'Saturn'}
        texture={saturnTexture}
        ephemerides={data.saturn}
      ></Orbit>
      <Orbit
        name={'Uranus'}
        texture={uranusTexture}
        ephemerides={data.uranus}
      ></Orbit>
      <Orbit
        name={'Neptune'}
        texture={neptuneTexture}
        ephemerides={data.neptune}
      ></Orbit>
    </Body>
  );
};
