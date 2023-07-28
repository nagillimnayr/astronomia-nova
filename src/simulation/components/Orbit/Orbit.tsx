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
  Matrix4,
  Mesh,
  type Object3D,
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
import {
  getPosition,
  getPositionFromRadius,
} from '@/simulation/math/orbital-elements/Position';
import { Object3DNode, extend, useFrame } from '@react-three/fiber';
import { type BodyKey } from '@/lib/horizons/BodyKey';
import { trpc } from '@/lib/trpc/trpc';
import { useQuery } from '@tanstack/react-query';
import {
  getSemiMinorAxisFromApsides,
  getSemiMinorAxisFromSemiLatusRectum,
} from '@/simulation/math/orbital-elements/axes/SemiMinorAxis';
import { getSemiLatusRectumFromEccentricity } from '@/simulation/math/orbital-elements/axes/SemiLatusRectum';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { getLinearEccentricityFromEccentricity } from '@/simulation/math/orbital-elements/LinearEccentricity';
import { getLinearEccentricityFromAxes } from '../../math/orbital-elements/LinearEccentricity';
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';

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

  // const elements = useMemo(() => {
  //   if (!ephemeridesQuery.data) return null;
  //   const { elementTable, vectorTable, physicalData } = ephemeridesQuery.data;
  //   const { eccentricity, semiMajorAxis } = elementTable;

  //   const position = new Vector3(...vectorTable.position);
  //   const velocity = new Vector3(...vectorTable.velocity);

  //   const elements = calculateOrbitFromStateVectors(
  //     position,
  //     velocity,
  //     centralMass,
  //     physicalData.mass
  //   );

  //   _pos.set(...elements.position).divideScalar(DIST_MULT);
  //   _vel.set(...elements.velocity).divideScalar(DIST_MULT);
  //   console.log('pos scaled:', _pos.toArray());
  //   console.log('vel scaled:', _vel.toArray());
  //   return {
  //     position: _pos.toArray(),
  //     velocity: _vel.toArray(),

  //     semiMajorAxis: elements.semiMajorAxis / DIST_MULT,
  //     semiMinorAxis: elements.semiMinorAxis / DIST_MULT,
  //     semiLatusRectum: elements.semiLatusRectum / DIST_MULT,
  //     periapsis: elements.periapsis / DIST_MULT,
  //     apoapsis: elements.apoapsis / DIST_MULT,

  //     eccentricity: elements.eccentricity,

  //     inclination: elements.inclination,
  //     longitudeOfAscendingNode: elements.longitudeOfAscendingNode,
  //     argumentOfPeriapsis: elements.argumentOfPeriapsis,

  //     trueAnomaly: elements.trueAnomaly,
  //   };
  // }, [centralMass, ephemeridesQuery.data]);

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
  // _vel.set(...vectorTable.velocity);
  _vel.copy(getVelocityDirectionFromOrbitalElements(trueAnomaly, eccentricity));
  _vel.normalize();
  _vel.multiplyScalar(orbitalSpeed);

  const bodyParams: BodyParams = {
    name: name,
    color: 'white',
    mass: physicalData.mass,
    meanRadius: physicalData.meanRadius,
    obliquity: physicalData.obliquity,
    // initialPosition: vectorTable.position.map(
    //   (val) => val / DIST_MULT
    // ) as Vector3Tuple,
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
