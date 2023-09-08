import type KeplerBody from '@/components/canvas/body/kepler-body';
import { KeplerOrbit } from '@/components/canvas/orbit/kepler-orbit';
import { Z_AXIS } from '@/constants/constants';
import KeplerTreeContext from '@/context/KeplerTreeContext';
import { colorMap } from '@/helpers/color-map';
import { type BodyKey } from '@/helpers/horizons/BodyKey';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { extend, type Object3DNode } from '@react-three/fiber';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { type Texture, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { type BodyParams } from '../body/Body';
import { Body } from '../body';
import { Trajectory } from './trajectory/Trajectory';
import { TrueAnomalyArrow } from './TrueAnomalyArrow';
import { ComputedEphemerides } from '@/helpers/horizons/types/ComputedEphemerides';

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
  ephemerides: ComputedEphemerides;
};

export const Orbit = ({ children, name, texture, ephemerides }: OrbitProps) => {
  const { mapActor } = MachineContext.useSelector(({ context }) => context);

  // Refs.
  const orbitRef = useRef<KeplerOrbit | null>(null);
  const orbitingBodyRef = useRef<KeplerBody | null>(null);
  const centralBodyRef = useContext(KeplerTreeContext);

  const { ephemerisTable, physicalDataTable } = ephemerides;

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
    longitudeOfAscendingNode,
    argumentOfPeriapsis,
    inclination,
  } = ephemerisTable;

  const color = colorMap.get(name) ?? 'white';
  const {
    mass,
    meanRadius,
    obliquity,
    siderealRotRate,
    siderealRotationPeriod,
  } = physicalDataTable;

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    // To orient the orbit correctly, we need to perform three intrinsic
    // rotations. (Intrinsic meaning that the rotations are performed in
    // the local coordinate space, such that when we rotate around the axes
    // in the order y-x-y, the last y-axis rotation is around a different
    // world-space axis than the first one, as the x-axis rotation changes
    // the orientation of the object's local y-axis. For clarity, the
    // rotations will be in the order y-x'-y'', where x' is the new local
    // x-axis after the first rotation and y'' is the object's new local
    // y-axis after the second rotation.)
    orbit.rotation.set(0, 0, 0); // Reset the rotation before we perform
    // the intrinsic rotations.
    orbit.getWorldPosition(_pos);
    _pos.add(Z_AXIS);
    orbit.lookAt(_pos);
    orbit.rotateY(degToRad(longitudeOfAscendingNode));
    orbit.rotateX(degToRad(inclination));
    orbit.rotateY(degToRad(argumentOfPeriapsis));
  }, [argumentOfPeriapsis, inclination, longitudeOfAscendingNode]);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    mapActor.send({ type: 'ADD_ORBIT', orbit }); // Add to map.
  }, [mapActor]);

  return (
    <keplerOrbit
      name={name}
      ref={orbitRef}
      semiMajorAxis={semiMajorAxis}
      semiMinorAxis={semiMinorAxis}
      semiLatusRectum={semiLatusRectum}
      linearEccentricity={linearEccentricity}
      eccentricity={eccentricity}
      inclination={inclination}
      longitudeOfAscendingNode={longitudeOfAscendingNode}
      argumentOfPeriapsis={argumentOfPeriapsis}
      orbitalPeriod={siderealOrbitPeriod}
    >
      <Body
        ref={orbitingBodyRef}
        color={color}
        name={name}
        initialPosition={initialPosition}
        initialVelocity={initialVelocity}
        obliquity={obliquity}
        siderealRotationRate={siderealRotRate}
        siderealRotationPeriod={siderealRotationPeriod}
        mass={mass}
        meanRadius={meanRadius}
        texture={texture}
      >
        {children}
      </Body>

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
