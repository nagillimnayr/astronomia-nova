import React, { useEffect, useRef } from 'react';
import Body from '../Body/Body';
import type KeplerBody from '../../classes/KeplerBody';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import { DIST_MULT, SOLAR_MASS, SUN_RADIUS } from '../../utils/constants';
import { useTexture } from '@react-three/drei';
import { CelestialSphere } from '../CelestialSphere';
import {
  Selection,
  EffectComposer,
  Outline,
} from '@react-three/postprocessing';
import { Orbit } from '../Orbit/Orbit';
import { useSimStore } from '@/simulation/state/zustand/sim-store';

export type UpdateFn = (deltaTime: number) => void;

const SolarSystem = () => {
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

  // use ref to store root of tree
  const rootRef = useRef<KeplerBody>(null!);

  // set root of tree in external store
  useEffect(() => {
    // this should only run on mount
    console.log('Passing rootRef to external store');
    useSimStore.setState({ rootRef: rootRef });
  }, []);

  return (
    <KeplerTreeContext.Provider value={null}>
      <CelestialSphere>
        {/* <Selection> */}
        {/* <EffectComposer autoClear={false} multisampling={8}>
            <Outline
              blur
              edgeStrength={100}
              visibleEdgeColor={0xffffff}
              width={1000}
            />
          </EffectComposer> */}

        <Body
          ref={rootRef}
          params={{
            name: 'Sun',
            mass: SOLAR_MASS,
            color: 0xfdee00,
            meanRadius: SUN_RADIUS * 10,
            initialPosition: [0, 0, 0],
            initialVelocity: [0, 0, 0],
          }}
          texture={sunTexture}
        >
          <Orbit name={'Mercury'} texture={mercuryTexture}></Orbit>
          <Orbit name={'Venus'} texture={venusTexture}></Orbit>
          <Orbit name={'Earth'} texture={earthTexture}>
            {/* <Orbit name={'Moon'} texture={moonTexture}></Orbit> */}
          </Orbit>
          <Orbit name={'Mars'} texture={marsTexture}></Orbit>
          <Orbit name={'Jupiter'} texture={jupiterTexture}></Orbit>
          <Orbit name={'Saturn'} texture={saturnTexture}></Orbit>
          <Orbit name={'Uranus'} texture={uranusTexture}></Orbit>
          <Orbit name={'Neptune'} texture={neptuneTexture}></Orbit>
        </Body>
        {/* </Selection> */}
      </CelestialSphere>
    </KeplerTreeContext.Provider>
  );
};

export default SolarSystem;
