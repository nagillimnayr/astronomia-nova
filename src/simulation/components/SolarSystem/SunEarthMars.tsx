import React, { useMemo, useRef } from 'react';
import Body from '../Body/Body';
import type KeplerBody from '../../classes/KeplerBody';
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
import { keplerTreeState } from '../../state/keplerTreeState';
import { Orbit } from '../Orbit/Orbit';
import { RetrogradeContext } from '../Retrograde/RetrogradeContext';
import { BodyMesh } from '../Body/BodyMesh';
import { Vector3 } from 'three';

export type UpdateFn = (deltaTime: number) => void;
const SunEarthMars = () => {
  const [sunTexture, earthTexture, marsTexture] = useTexture([
    'assets/textures/2k_sun.jpg',
    'assets/textures/2k_earth_daymap.jpg',
    'assets/textures/2k_mars.jpg',
  ]);
  // use ref to store root of tree
  const rootRef = useRef<KeplerBody>(null!);

  const assignAsRoot = (body: KeplerBody) => {
    if (!body) {
      return;
    }
    keplerTreeState.setRoot(body);
  };

  return (
    <KeplerTreeContext.Provider value={assignAsRoot}>
      <CelestialSphere>
        <Selection>
          <EffectComposer autoClear={false} multisampling={8}>
            <Outline
              blur
              edgeStrength={100}
              visibleEdgeColor={0xffffff}
              width={1000}
            />
          </EffectComposer>

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
            <RetrogradeContext.Provider value={'referenceBody'}>
              <Orbit name={'Earth'} texture={earthTexture}></Orbit>
            </RetrogradeContext.Provider>
            <RetrogradeContext.Provider value={'otherBody'}>
              <Orbit name={'Mars'} texture={marsTexture}></Orbit>
            </RetrogradeContext.Provider>
          </Body>
        </Selection>
      </CelestialSphere>
    </KeplerTreeContext.Provider>
  );
};

export default SunEarthMars;
