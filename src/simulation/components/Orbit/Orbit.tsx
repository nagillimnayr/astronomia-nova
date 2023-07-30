import { Trajectory } from './Trajectory/Trajectory';
import { useCallback, useContext, useMemo, useRef } from 'react';
import Body, { type BodyParams } from '../Body/Body';
import type KeplerBody from '@/simulation/classes/kepler-body';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { CentralMassContext } from '@/simulation/context/CentralMassContext';
import {
  calculateOrbitFromPeriapsis,
  calculateOrbitFromStateVectors,
} from '@/simulation/math/orbit/calculateOrbit';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
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
  // const retrogradeContext = useContext(RetrogradeContext);

  // Ref to KeplerOrbit.
  const orbitRef = useRef<KeplerOrbit | null>(null);
  // Reference to orbiting body.
  const orbitingBodyRef = useRef<KeplerBody | null>(null);

  const centralBodyRef = useContext(KeplerTreeContext);

  const ephemeridesQuery = trpc.loadEphemerides.useQuery({ name: name });
  // const [ephemeridesData, ephemeridesQuery] =
  //   trpc.loadEphemerides.useSuspenseQuery({ name: name });
  // ephemeridesQuery.;
  // If data hasn't loaded yet, return and wait until it has.
  if (!ephemeridesQuery.data) {
    return;
  }

  // Get Central mass from parent.
  if (!centralBodyRef?.current) {
    console.log('centralBodyRef.current is null');
    return;
  }
  const centralMass = centralBodyRef.current.mass;

  const { elementTable, vectorTable, physicalData } = ephemeridesQuery.data;

  const semiLatusRectum = getSemiLatusRectumFromEccentricity(
    elementTable.semiMajorAxis,
    elementTable.eccentricity
  );
  const semiMinorAxis = getSemiMinorAxisFromSemiLatusRectum(
    elementTable.semiMajorAxis,
    semiLatusRectum
  );
  const semiMajorAxis = elementTable.semiMajorAxis;

  const linearEccentricity = getLinearEccentricityFromAxes(
    semiMajorAxis,
    semiMinorAxis
  );

  const { eccentricity, trueAnomaly, periapsis } = elementTable;

  _pos.set(...getPosition(trueAnomaly, semiMajorAxis, eccentricity));
  const radius = getRadiusAtTrueAnomaly(
    trueAnomaly,
    semiMajorAxis,
    eccentricity
  );
  // Todo: Memoize all of these computations externally.
  // The Horizons ephemeris data for Jupiter seems to result in it wobbling a bit on its orbit. Using the Vis-Viva equation to re-calculate the velocity seems to fix it though. It also appears to have fixed some wobble with the moon.
  // _pos.set(...vectorTable.position);

  const orbitalSpeed = getOrbitalSpeedFromRadius(
    radius,
    centralMass,
    semiMajorAxis
  );
  _vel.copy(getVelocityDirectionFromOrbitalElements(trueAnomaly, eccentricity));
  _vel.normalize();
  _vel.multiplyScalar(orbitalSpeed);

  const color = colorMap.get(name) ?? 'white';
  const bodyParams: BodyParams = {
    name: name,
    color,
    mass: physicalData.table.mass,
    meanRadius: physicalData.table.meanRadius,
    obliquity: physicalData.table.obliquity,
    initialPosition: _pos.divideScalar(DIST_MULT).toArray(),
    initialVelocity: _vel.divideScalar(DIST_MULT).toArray(),
  };

  // Destructure the orientation elements.
  const { longitudeOfAscendingNode, argumentOfPeriapsis, inclination } =
    elementTable;
  return (
    <keplerOrbit
      ref={(orbit) => {
        if (!orbit) return;
        if (orbitRef.current === orbit) return;
        orbitRef.current = orbit;

        // To orient the orbit correctly, we need to perform three intrinsic rotations. (Intrinsic meaning that the rotations are performed in the local coordinate space, such that when we rotate around the axes in the order z-x-z, the last z-axis rotation is around a different world-space axis than the first one, as the x-axis rotation changes the orientation of the object's local z-axis. For clarity, the rotations will be in the order z-x'-z'', where x' is the new local x-axis after the first rotation and z'' is the object's new local z-axis after the second rotation.)
        orbit.rotateZ(degToRad(longitudeOfAscendingNode));
        orbit.rotateX(degToRad(inclination));
        orbit.rotateZ(degToRad(argumentOfPeriapsis));
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
        },
      ]}
    >
      <object3D>
        <Body ref={orbitingBodyRef} params={bodyParams} texture={texture}>
          {children}
        </Body>

        <Trajectory
          semiMajorAxis={semiMajorAxis}
          semiMinorAxis={semiMinorAxis}
          linearEccentricity={linearEccentricity}
          periapsis={periapsis}
          orientation={{
            longitudeOfAscendingNode,
            argumentOfPeriapsis,
            inclination,
          }}
        />
        <TrueAnomalyArrow color={'#ffffff'} target={orbitingBodyRef} />
      </object3D>
    </keplerOrbit>
  );
};
