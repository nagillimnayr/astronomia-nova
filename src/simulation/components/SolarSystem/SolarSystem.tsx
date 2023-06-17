import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { type DynamicBody } from '../../classes/Dynamics';
import Body from '../Body/Body';
import loadBodyPreset from '../../utils/loadBodyPreset';
import type KeplerBody from '../../classes/KeplerBody';
import { traverseTree } from '../../classes/KeplerBody';
import KeplerTreeContext from '../../context/KeplerTreeContext';
//import { useEventListener } from "@react-hooks-library/core";
import { makeFixedUpdateFn } from '../../systems/FixedTimeStep';
import { DAY, SOLAR_MASS } from '../../utils/constants';
import { Bounds, useTexture } from '@react-three/drei';
import { TextureLoader } from 'three';
import { CelestialSphere } from '../CelestialSphere';
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from '@react-three/postprocessing';
import { useEventListener } from 'usehooks-ts';
import { simState, setRoot } from '~/simulation/state/SimState';
import { keplerTreeState } from '../../state/keplerTreeState';

export type UpdateFn = (deltaTime: number) => void;
const SolarSystem = forwardRef<UpdateFn>(function SolarSystem({}, updateRef) {
  // load textures
  // const [
  //   sunTexture,
  //   mercuryTexture,
  //   venusTexture,
  //   earthTexture,
  //   marsTexture,
  //   jupiterTexture,
  //   saturnTexture,
  //   uranusTexture,
  //   neptuneTexture,
  // ] = useLoader(TextureLoader, [
  //   "assets/textures/2k_sun.jpg",
  //   "assets/textures/2k_mercury.jpg",
  //   "assets/textures/2k_venus_atmosphere.jpg",
  //   "assets/textures/2k_earth_daymap.jpg",
  //   "assets/textures/2k_mars.jpg",
  //   "assets/textures/2k_jupiter.jpg",
  //   "assets/textures/2k_saturn.jpg",
  //   "assets/textures/2k_uranus.jpg",
  //   "assets/textures/2k_neptune.jpg",
  // ]);
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
  ] = [
    'assets/textures/2k_sun.jpg',
    'assets/textures/2k_mercury.jpg',
    'assets/textures/2k_venus_atmosphere.jpg',
    'assets/textures/2k_earth_daymap.jpg',
    'assets/textures/2k_mars.jpg',
    'assets/textures/2k_jupiter.jpg',
    'assets/textures/2k_saturn.jpg',
    'assets/textures/2k_uranus.jpg',
    'assets/textures/2k_neptune.jpg',
  ];
  // use ref to store root of tree
  const root = useRef<KeplerBody>(null!);

  const assignAsRoot = (body: KeplerBody) => {
    if (!body) {
      return;
    }
    console.log(`setting ${body.name} as root`);
    keplerTreeState.setRoot(body);
  };

  const fixedUpdate = useCallback(
    makeFixedUpdateFn((timeStep: number) => {
      traverseTree(root.current, timeStep * DAY);
    }, 24),
    []
  );

  // pass fixedUpdate back up to parent
  useImperativeHandle(
    updateRef,
    () => {
      return fixedUpdate;
    },
    [fixedUpdate]
  );

  useEventListener('keypress', (e) => {
    e.preventDefault();
    if (e.key === ' ') {
      console.log('root: ', root);
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
            ref={root}
            args={{
              name: 'Sun',
              mass: SOLAR_MASS,
              color: 0xfdee00,
              meanRadius: 1.5,
              initialPosition: 0,
              initialVelocity: 0,
            }}
            texturePath={sunTexture}
          >
            <Body
              args={loadBodyPreset('Mercury')}
              texturePath={mercuryTexture}
            ></Body>
            <Body
              args={loadBodyPreset('Venus')}
              texturePath={venusTexture}
            ></Body>
            <Body
              args={loadBodyPreset('Earth')}
              texturePath={earthTexture}
            ></Body>
            <Body
              args={loadBodyPreset('Mars')}
              texturePath={marsTexture}
            ></Body>
            <Body
              args={loadBodyPreset('Jupiter')}
              texturePath={jupiterTexture}
            ></Body>
            <Body
              args={loadBodyPreset('Saturn')}
              texturePath={saturnTexture}
            ></Body>
            <Body
              args={loadBodyPreset('Uranus')}
              texturePath={uranusTexture}
            ></Body>
            <Body
              args={loadBodyPreset('Neptune')}
              texturePath={neptuneTexture}
            ></Body>
          </Body>
        </Selection>
      </CelestialSphere>
    </KeplerTreeContext.Provider>
  );
});

export default SolarSystem;
