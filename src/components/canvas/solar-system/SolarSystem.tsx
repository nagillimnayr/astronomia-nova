import { type KeplerBody } from '@/components/canvas/body';
import { trpc } from '@/helpers/trpc/trpc';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useTexture } from '@react-three/drei';
import { useMemo, useRef, type JSX } from 'react';
import { Body } from '../body';
import { Orbit } from '../orbit/Orbit';
import { colorMap } from '@/helpers/color-map';
import { MeshLambertMaterial } from 'three';

/**
 * @description Component representing the Solar System
 * @returns {JSX.Element}
 * @constructor
 */
export const SolarSystem = (): JSX.Element => {
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
  const [data, dataQuery] = trpc.loadAllEphemerides.useSuspenseQuery();

  const rootRef = useRef<KeplerBody>(null!);

  const { keplerTreeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const sunParams = data.sun.table;
  const sunColor = colorMap.get('Sun');
  const sunMaterial = useMemo(() => {
    return new MeshLambertMaterial({
      color: sunColor,
      map: sunTexture,
      emissive: 'white',
      emissiveMap: sunTexture,
      emissiveIntensity: 1.5,
    });
  }, [sunColor, sunTexture]);

  if (dataQuery.isError) {
    console.error(dataQuery.error);
    return <></>;
  }
  // If data hasn't loaded yet, return and wait until it has.
  if (dataQuery.isLoading) return <></>;
  if (!dataQuery.data) return <></>;
  return (
    <Body
      ref={(root: KeplerBody) => {
        if (!root) return;
        if (rootRef.current === root) return <></>;
        rootRef.current = root;
        keplerTreeActor.send({ type: 'ASSIGN_ROOT', root });
      }}
      name={'Sun'}
      mass={sunParams.mass}
      color={sunColor ?? 'white'}
      meanRadius={sunParams.meanRadius}
      siderealRotationRate={sunParams.siderealRotationRate}
      siderealRotationPeriod={sunParams.siderealRotationPeriod}
      texture={sunTexture}
      material={sunMaterial}
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
