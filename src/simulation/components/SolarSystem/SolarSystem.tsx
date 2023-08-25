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
      <Suspense>
        <CelestialSphere />

        <group rotation={[-degToRad(90), 0, 0]}>
          <Suspense>{children}</Suspense>
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
      </Suspense>
    </group>
  );
};

export default SolarSystem;
