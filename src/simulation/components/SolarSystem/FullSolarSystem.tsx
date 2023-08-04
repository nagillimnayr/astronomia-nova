import React, { forwardRef, useContext } from 'react';
import Body from '../Body/Body';
import type KeplerBody from '../../classes/kepler-body';
import { SOLAR_MASS, SUN_RADIUS } from '../../utils/constants';
import { useTexture } from '@react-three/drei';

import { Orbit } from '../Orbit/Orbit';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { EARTH_RADIUS } from '@/lib/utils/constants';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

const FullSolarSystem = () => {
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
  const rootRef = useContext(KeplerTreeContext);

  const { keplerTreeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  return (
    <Body
      ref={(root) => {
        if (!root) return;
        if (rootRef) {
          rootRef.current = root;
        }
        keplerTreeActor.send({ type: 'ASSIGN_ROOT', root });
      }}
      params={{
        name: 'Sun',
        mass: SOLAR_MASS,
        color: 0xfdee00,
        meanRadius: SUN_RADIUS / 10,
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

export { FullSolarSystem };
