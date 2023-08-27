import React, { PropsWithChildren, Suspense, useEffect, useRef } from 'react';

import KeplerTreeContext from '../../context/KeplerTreeContext';
import { CelestialSphere } from '@/simulation/components/celestial-sphere/CelestialSphere';

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
  return (
    <group>
      <CelestialSphere />

      <group rotation={[-degToRad(90), 0, 0]}>
        {children}
        <ReferenceAxis
          color={'red'}
          length={SOLAR_SYSTEM_RADIUS}
          direction={X_AXIS}
        />
        <ReferenceAxis
          color={'#03C03C'}
          length={SOLAR_SYSTEM_RADIUS}
          direction={X_AXIS_NEG}
        />
      </group>
    </group>
  );
};

export default SolarSystem;
