import { type KeplerBody } from '@/components/canvas/body/kepler-body';
import { KeplerOrbit } from '@/components/canvas/orbit/kepler-orbit';
import { Z_AXIS } from '@/constants/constants';
import { KeplerTreeContext } from '@/context/KeplerTreeContext';
import { colorMap } from '@/helpers/color-map';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { extend, type Object3DNode } from '@react-three/fiber';
import { type PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { type Texture, Vector3 } from 'three';
import { Body } from '@/components/canvas/body';
import { Trajectory } from './Trajectory';
import { type Ephemerides } from '@/helpers/horizons/types/Ephemerides';
import { useRootStore } from '@/state/root-store';

const _pos = new Vector3();

// Extend KeplerOrbit so the reconciler is aware of it.
extend({ KeplerOrbit });
declare module '@react-three/fiber' {
  interface ThreeElements {
    keplerOrbit: Object3DNode<KeplerOrbit, typeof KeplerOrbit>;
  }
}

export type OrbitProps = PropsWithChildren & {
  name: string;
  texture?: Texture;
  ephemerides: Ephemerides;
};

/**
 * @param {string} name
 * @param {Texture | undefined} texture
 * @param {Ephemerides} ephemerides
 * @returns {JSX.Element}
 * @constructor
 */
export const Orbit = ({ children, name, texture, ephemerides }: OrbitProps) => {
  const { mapActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Refs.
  const orbitRef = useRef<KeplerOrbit | null>(null);
  const orbitingBodyRef = useRef<KeplerBody | null>(null);
  const centralBodyRef = useContext(KeplerTreeContext);

  const { elementTable, vectorTable, physicalDataTable } = ephemerides;

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
    longitudeOfAscendingNode,
    argumentOfPeriapsis,
    inclination,

    meanAnomaly,
    meanMotion,
  } = elementTable;

  const { position: initialPosition, velocity: initialVelocity } = vectorTable;

  const color = colorMap.get(name) ?? 'white';
  const {
    mass,
    meanRadius,
    obliquity,
    siderealRotationRate,
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
    orbit.rotateY(longitudeOfAscendingNode);
    orbit.rotateX(inclination);
    orbit.rotateY(argumentOfPeriapsis);
  }, [argumentOfPeriapsis, inclination, longitudeOfAscendingNode]);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    mapActor.send({ type: 'ADD_ORBIT', orbit }); // Add to map.
  }, [mapActor]);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit || !centralBodyRef) return;
    const centralBody = centralBodyRef.current;
    if (!centralBody) return;
    orbit.centralBody = centralBody;
  }, [centralBodyRef]);

  useEffect(() => {
    const subscription = timeActor.subscribe((state) => {
      const orbit = orbitRef.current;
      if (!orbit) return;
      const event = state.event.type;
      if (
        event !== 'ADVANCE_TIME' &&
        event !== 'UPDATE' &&
        event !== 'SET_DATE' &&
        event !== 'SET_DATE_TO_NOW'
      )
        return;
      const { timeElapsed } = state.context;
      orbit.updateOrbitingBody(timeElapsed);
    });

    return () => subscription.unsubscribe();
  }, [timeActor]);

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
      initialMeanAnomaly={meanAnomaly}
      meanMotion={meanMotion}
    >
      <Body
        ref={orbitingBodyRef}
        color={color}
        name={name}
        initialPosition={initialPosition}
        initialVelocity={initialVelocity}
        obliquity={obliquity}
        siderealRotationRate={siderealRotationRate}
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
    </keplerOrbit>
  );
};
