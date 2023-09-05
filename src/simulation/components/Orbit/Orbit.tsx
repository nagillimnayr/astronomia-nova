import { Trajectory } from './Trajectory/Trajectory';
import { useCallback, useContext, useMemo, useRef } from 'react';
import Body, { type BodyParams } from '../Body/Body';
import type KeplerBody from '@/simulation/classes/kepler-body';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import {
  calculateOrbitFromPeriapsis,
  calculateOrbitFromStateVectors,
} from '@/simulation/math/orbit/calculateOrbit';
import {
  DIST_MULT,
  TIME_MULT,
  DAY,
  X_AXIS,
  Z_AXIS,
} from '@/simulation/utils/constants';
import { TrueAnomalyArrow } from './arrows/TrueAnomalyArrow';
import {
  ColorRepresentation,
  type Texture,
  Vector3,
  Vector3Tuple,
} from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { RetrogradeContext } from '../Retrograde/RetrogradeContext';
import { retrogradeState } from '../Retrograde/retrogradeState';
import { getRadiusAtTrueAnomaly } from '@/simulation/math/orbital-elements/OrbitalRadius';
import {
  getOrbitalSpeedFromRadius,
  getVelocityDirectionFromOrbitalElements,
} from '@/simulation/math/orbital-elements/Velocity';
import { getPosition } from '@/simulation/math/orbital-elements/Position';
import { Object3DNode, extend, useFrame } from '@react-three/fiber';
import { type BodyKey } from '@/lib/horizons/BodyKey';
import { trpc } from '@/lib/trpc/trpc';
import {
  getSemiMinorAxisFromApsides,
  getSemiMinorAxisFromSemiLatusRectum,
} from '@/simulation/math/orbital-elements/axes/SemiMinorAxis';
import { getSemiLatusRectumFromEccentricity } from '@/simulation/math/orbital-elements/axes/SemiLatusRectum';

import { getLinearEccentricityFromAxes } from '../../math/orbital-elements/LinearEccentricity';
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import { colorMap } from '@/simulation/utils/color-map';
import { Trail } from '../Body/trail/Trail';
import { BodyTrail } from '../Body/trail/BodyTrail';
import { calculateOrbitalPeriod } from '@/simulation/math/orbital-elements/OrbitalPeriod';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

const _pos = new Vector3();
const _vel = new Vector3();

// Extend KeplerOrbit so the reconciler is aware of it.
extend({ KeplerOrbit });
declare module '@react-three/fiber' {
  interface ThreeElements {
    keplerOrbit: Object3DNode<KeplerOrbit, typeof KeplerOrbit>;
  }
}

type OrbitProps = {
  children?: React.ReactNode;
  name: BodyKey;
  texture?: Texture;
};

export const Orbit = ({ children, name, texture }: OrbitProps) => {
  const { mapActor } = MachineContext.useSelector(({ context }) => context);

  // Ref to KeplerOrbit.
  const orbitRef = useRef<KeplerOrbit | null>(null);
  // Reference to orbiting body.
  const orbitingBodyRef = useRef<KeplerBody | null>(null);

  const centralBodyRef = useContext(KeplerTreeContext);

  const ephemeridesQuery = trpc.loadComputedEphemerides.useQuery({
    name: name,
  });

  // If data hasn't loaded yet, return and wait until it has.
  if (!ephemeridesQuery.data) {
    return;
  }

  // Get Central mass from parent.
  if (!centralBodyRef?.current) {
    console.log('centralBodyRef.current is null');
    return;
  }

  const { ephemerisTable, physicalDataTable } = ephemeridesQuery.data;

  const {
    semiMajorAxis,
    semiMinorAxis,
    semiLatusRectum,
    eccentricity,
    linearEccentricity,
    apoapsis,
    trueAnomaly,
    periapsis,
    siderealOrbitPeriod,
    initialPosition,
    initialVelocity,
  } = ephemerisTable;

  const color = colorMap.get(name) ?? 'white';
  const {
    mass,
    meanRadius,
    obliquity,
    siderealRotRate,
    siderealRotationPeriod,
  } = physicalDataTable;
  const bodyParams: BodyParams = {
    name,
    color,
    mass,
    meanRadius,
    obliquity,
    initialPosition,
    initialVelocity,
    siderealRotRate,
    siderealRotationPeriod,
  };

  // Destructure the orientation elements.
  const { longitudeOfAscendingNode, argumentOfPeriapsis, inclination } =
    ephemerisTable;
  return (
    <keplerOrbit
      name={name}
      ref={(orbit) => {
        if (!orbit) {
          // if (orbitRef.current) {
          //   mapActor.send({
          //     type: 'REMOVE_ORBIT',
          //     name: orbitRef.current.name,
          //   }); // Remove from map.
          // }
          return;
        }
        if (orbitRef.current === orbit) return;
        orbitRef.current = orbit;
        mapActor.send({ type: 'ADD_ORBIT', orbit }); // Add to map.

        // To orient the orbit correctly, we need to perform three intrinsic rotations. (Intrinsic meaning that the rotations are performed in the local coordinate space, such that when we rotate around the axes in the order z-x-z, the last z-axis rotation is around a different world-space axis than the first one, as the x-axis rotation changes the orientation of the object's local z-axis. For clarity, the rotations will be in the order z-x'-z'', where x' is the new local x-axis after the first rotation and z'' is the object's new local z-axis after the second rotation.)
        orbit.rotation.set(0, 0, 0); // Reset the rotation before we perform the intrinsic rotations.
        orbit.getWorldPosition(_pos);
        _pos.add(Z_AXIS);
        orbit.lookAt(_pos);
        orbit.rotateY(degToRad(longitudeOfAscendingNode));
        orbit.rotateX(degToRad(inclination));
        orbit.rotateY(degToRad(argumentOfPeriapsis));
      }}
      orbitingBodyRef={orbitingBodyRef}
      centralBodyRef={centralBodyRef}
      args={[
        {
          semiMajorAxis,
          semiMinorAxis,
          semiLatusRectum,
          linearEccentricity,
          eccentricity,
          longitudeOfAscendingNode,
          argumentOfPeriapsis,
          inclination,
          orbitalPeriod: siderealOrbitPeriod,
        },
      ]}
    >
      {/* <axesHelper scale={1e12} /> */}
      <Body ref={orbitingBodyRef} params={bodyParams} texture={texture}>
        {children}
      </Body>
      {/* <BodyTrail
        bodyRef={orbitingBodyRef}
        orbitalPeriod={orbitalPeriod}
        color={color}
        lineWidth={meanRadius / DIST_MULT}
      /> */}

      <Trajectory
        semiMajorAxis={semiMajorAxis}
        semiMinorAxis={semiMinorAxis}
        linearEccentricity={linearEccentricity}
        periapsis={periapsis}
        bodyRef={orbitingBodyRef}
      />
      <TrueAnomalyArrow color={'#ffffff'} target={orbitingBodyRef} />
    </keplerOrbit>
  );
};
