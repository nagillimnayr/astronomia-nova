import { Trajectory } from './Trajectory/Trajectory';
import { useCallback, useContext, useMemo, useRef } from 'react';
import Body, { type BodyParams } from '../Body/Body';
import type KeplerBody from '@/simulation/classes/KeplerBody';
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
import { getPositionFromRadius } from '@/simulation/math/orbital-elements/Position';
import { useFrame } from '@react-three/fiber';
import { type BodyKey } from '@/lib/horizons/BodyKey';
import { trpc } from '@/lib/trpc/trpc';
import { useQuery } from '@tanstack/react-query';
import {
  getSemiMinorAxisFromApsides,
  getSemiMinorAxisFromSemiLatusRectum,
} from '@/simulation/math/orbital-elements/axes/SemiMinorAxis';
import { getSemiLatusRectumFromEccentricity } from '@/simulation/math/orbital-elements/axes/SemiLatusRectum';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

const _pos = new Vector3();
const _vel = new Vector3();

type OrbitProps = {
  children?: React.ReactNode;
  name: BodyKey;
  texture?: Texture;
};

export const Orbit = ({ children, name, texture }: OrbitProps) => {
  const { cameraState } = useContext(RootStoreContext);
  // get Central mass from parent
  const centralMass = useContext(CentralMassContext);

  // const retrogradeContext = useContext(RetrogradeContext);

  // ref to Object3D
  const orbitRef = useRef<Object3D>(null!);
  // reference to orbiting body
  const bodyRef = useRef<KeplerBody>(null!);

  const centralBodyRef = useContext(KeplerTreeContext);
  // useFrame(() => {
  //   if (!centralBodyRef || !centralBodyRef.current || !orbitRef.current) return;
  //   orbitRef.current.position.copy(centralBodyRef.current.position);
  //   cameraState.updateCamera();
  // }, -1);

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

  const { elementTable, vectorTable, physicalData } = ephemeridesQuery.data;

  const semiLatusRectum = getSemiLatusRectumFromEccentricity(
    elementTable.semiMajorAxis,
    elementTable.eccentricity
  );
  const semiMinorAxis =
    getSemiMinorAxisFromSemiLatusRectum(
      elementTable.semiMajorAxis,
      semiLatusRectum
    ) / DIST_MULT;
  const semiMajorAxis = elementTable.semiMajorAxis / DIST_MULT;

  const periapsis = elementTable.periapsis / DIST_MULT;

  const bodyParams: BodyParams = {
    name: name,
    color: 'white',
    mass: physicalData.mass,
    meanRadius: physicalData.meanRadius / EARTH_RADIUS,
    initialPosition: vectorTable.position.map(
      (val) => val / DIST_MULT
    ) as Vector3Tuple,
    initialVelocity: vectorTable.velocity.map(
      (val) => val / DIST_MULT
    ) as Vector3Tuple,
  };

  // Destructure the orientation elements.
  const { longitudeOfAscendingNode, argumentOfPeriapsis, inclination } =
    elementTable;

  return (
    <object3D
      ref={(obj) => {
        if (!obj) return;
        if (orbitRef.current === obj) return;
        orbitRef.current = obj;

        // To orient the orbit correctly, we need to perform three intrinsic rotations. (Intrinsic meaning that the rotations are performed in the local coordinate space, such that when we rotate around the axes in the order z-x-z, the last z-axis rotation is around a different world-space axis than the first one, as the x-axis rotation changes the orientation of the object's local z-axis. For clarity, the rotations will be in the order z-x'-z'', where x' is the new local x-axis after the first rotation and z'' is the object's new local z-axis after the second rotation.)
        // obj.rotateZ(degToRad(longitudeOfAscendingNode));
        // obj.rotateX(degToRad(inclination));
        // obj.rotateZ(degToRad(argumentOfPeriapsis));
      }}
    >
      <Body ref={bodyRef} params={bodyParams} texture={texture}>
        {children}
      </Body>

      <Trajectory
        semiMajorAxis={semiMajorAxis}
        semiMinorAxis={semiMinorAxis}
        periapsis={periapsis}
        orientation={{
          longitudeOfAscendingNode,
          argumentOfPeriapsis,
          inclination,
        }}
      />
      <TrueAnomalyArrow color={'#ffffff'} target={bodyRef} />
    </object3D>
  );
};
