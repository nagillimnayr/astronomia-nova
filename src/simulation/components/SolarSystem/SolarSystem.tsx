import React, { PropsWithChildren, useEffect, useRef } from 'react';
import Body from '../Body/Body';
import type KeplerBody from '../../classes/kepler-body';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import { CelestialSphere } from '@/simulation/components/celestial-sphere/CelestialSphere';
import {
  Selection,
  EffectComposer,
  Outline,
} from '@react-three/postprocessing';
import { useSimStore } from '@/simulation/state/zustand/sim-store';
import { degToRad } from 'three/src/math/MathUtils';
import { ReferenceAxis } from './reference-axis/ReferenceAxis';
import {
  PI,
  SOLAR_SYSTEM_RADIUS,
  X_AXIS,
  X_AXIS_NEG,
} from '@/simulation/utils/constants';

export type UpdateFn = (deltaTime: number) => void;

type Props = PropsWithChildren;
const SolarSystem = ({ children }: Props) => {
  // Use ref to store root of tree.
  const rootRef = useRef<KeplerBody>(null!);

  // Set root of tree in external store.
  useEffect(() => {
    // This should only run on mount.
    console.log('Passing rootRef to external store');
    useSimStore.setState({ rootRef: rootRef });
  }, []);

  return (
    <KeplerTreeContext.Provider value={rootRef}>
      <CelestialSphere />

      <group rotation={[-degToRad(90), 0, 0]}>
        {children}
        <ReferenceAxis
          color={'red'}
          length={SOLAR_SYSTEM_RADIUS}
          direction={X_AXIS}
        />
        <ReferenceAxis
          color={'green'}
          length={SOLAR_SYSTEM_RADIUS}
          direction={X_AXIS_NEG}
        />
      </group>
    </KeplerTreeContext.Provider>
  );
};

export default SolarSystem;
