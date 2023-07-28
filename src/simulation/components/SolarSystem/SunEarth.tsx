import React, { useRef } from 'react';
import Body from '../Body/Body';
import type KeplerBody from '../../classes/kepler-body';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import { SOLAR_MASS } from '../../utils/constants';
import { useTexture } from '@react-three/drei';
import { CelestialSphere } from '../CelestialSphere';
import {
  Selection,
  EffectComposer,
  Outline,
} from '@react-three/postprocessing';
// import { keplerTreeState } from '../../state/keplerTreeState';
import { Orbit } from '../Orbit/Orbit';

export type UpdateFn = (deltaTime: number) => void;
const SunEarth = () => {
  const [sunTexture, earthTexture, marsTexture] = useTexture([
    'assets/textures/2k_sun.jpg',
    'assets/textures/2k_earth_daymap.jpg',
    'assets/textures/2k_mars.jpg',
  ]);
  // use ref to store root of tree
  const rootRef = useRef<KeplerBody>(null!);

  return (
    <KeplerTreeContext.Provider value={null}>
      <CelestialSphere>
        <Body
          ref={rootRef}
          params={{
            name: 'Sun',
            mass: SOLAR_MASS,
            color: 0xfdee00,
            meanRadius: 1.5,
            initialPosition: [0, 0, 0],
            initialVelocity: [0, 0, 0],
          }}
          texture={sunTexture}
        >
          <Orbit name={'Earth'} texture={earthTexture}></Orbit>
        </Body>
      </CelestialSphere>
    </KeplerTreeContext.Provider>
  );
};

export default SunEarth;
