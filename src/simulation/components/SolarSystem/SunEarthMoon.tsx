import React, { useMemo, useRef } from 'react';
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
import { useEventListener } from 'usehooks-ts';
import { Orbit } from '../Orbit/Orbit';
import { RetrogradeContext } from '../Retrograde/RetrogradeContext';
import { BodyMesh } from '../Body/BodyMesh';
import { Vector3 } from 'three';

export type UpdateFn = (deltaTime: number) => void;
const EarthMoon = () => {
  const [sunTexture, earthTexture, moonTexture] = useTexture([
    'assets/textures/2k_sun.jpg',
    'assets/textures/2k_earth_daymap.jpg',
    'assets/textures/2k_moon.jpg',
  ]);

  if (!sunTexture) {
    console.error('error: could not load sun texture');
  }
  if (!earthTexture) {
    console.error('error: could not load earth texture');
  }
  if (!moonTexture) {
    console.error('error: could not load moon texture');
  }

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
          <Orbit name={'Earth'} texture={earthTexture}>
            <Orbit name={'Moon'} texture={moonTexture}></Orbit>
          </Orbit>
        </Body>
      </CelestialSphere>
    </KeplerTreeContext.Provider>
  );
};

export default EarthMoon;
