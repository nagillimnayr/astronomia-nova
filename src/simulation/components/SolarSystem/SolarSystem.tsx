import React, { useRef } from 'react';
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
import { BodyMesh } from '../Body/BodyMesh';

export type UpdateFn = (deltaTime: number) => void;
const SolarSystem = () => {
  const [
    sunTexture,
    mercuryTexture,
    venusTexture,
    earthTexture,
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
    'assets/textures/2k_mars.jpg',
    'assets/textures/2k_jupiter.jpg',
    'assets/textures/2k_saturn.jpg',
    'assets/textures/2k_uranus.jpg',
    'assets/textures/2k_neptune.jpg',
  ]);
  // use ref to store root of tree
  const rootRef = useRef<KeplerBody>(null!);

  const assignAsRoot = (body: KeplerBody) => {
    if (!body) {
      return;
    }
    keplerTreeState.setRoot(body);
  };

  useEventListener('keypress', (e) => {
    e.preventDefault();
    if (e.key === ' ') {
      console.log('root: ', rootRef.current);
      console.log('state root: ', keplerTreeState.root);
    }
  });

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
            args={{
              name: 'Sun',
              mass: SOLAR_MASS,
              color: 0xfdee00,
              meanRadius: 1.5,
              initialPosition: 0,
              initialVelocity: 0,
            }}
          >
            <BodyMesh
              name="Sun"
              color="0xfdee00"
              meanRadius={1.5}
              texture={sunTexture}
              body={rootRef}
            />
            <Orbit name={'Mercury'} texture={mercuryTexture}></Orbit>
            <Orbit name={'Venus'} texture={venusTexture}></Orbit>
            <Orbit name={'Earth'} texture={earthTexture}></Orbit>
            <Orbit name={'Mars'} texture={marsTexture}></Orbit>
            <Orbit name={'Jupiter'} texture={jupiterTexture}></Orbit>
            <Orbit name={'Saturn'} texture={saturnTexture}></Orbit>
            <Orbit name={'Uranus'} texture={uranusTexture}></Orbit>
            <Orbit name={'Neptune'} texture={neptuneTexture}></Orbit>
          </Body>
        </Selection>
      </CelestialSphere>
    </KeplerTreeContext.Provider>
  );
};

export default SolarSystem;
