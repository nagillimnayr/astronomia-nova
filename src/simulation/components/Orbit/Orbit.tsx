import { Trajectory } from './Trajectory/Trajectory';
import { useCallback, useContext, useMemo, useRef } from 'react';
import Body, { type BodyParams } from '../Body/Body';
import type KeplerBody from '@/simulation/classes/KeplerBody';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { CentralMassContext } from '@/simulation/context/CentralMassContext';
import { calculateOrbitFromPeriapsis } from '@/simulation/math/orbit/calculateOrbit';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { TrueAnomalyArrow } from './arrows/TrueAnomalyArrow';
import {
  ColorRepresentation,
  Matrix4,
  Mesh,
  type Object3D,
  type Texture,
  Vector3,
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
  useFrame(() => {
    if (!centralBodyRef || !centralBodyRef.current || !orbitRef.current) return;
    orbitRef.current.position.copy(centralBodyRef.current.position);
    cameraState.updateCamera();
  }, -1);

  const ephemeridesQuery = trpc.loadEphemerides.useQuery({ name: name });

  const elements = useMemo(() => {
    if (!ephemeridesQuery.data) return null;
    const { elementTable, vectorTable, physicalData } = ephemeridesQuery.data;
    const { eccentricity, semiMajorAxis } = elementTable;

    const semiLatusRectum = getSemiLatusRectumFromEccentricity(
      semiMajorAxis,
      eccentricity
    );
    const semiMinorAxis = getSemiMinorAxisFromSemiLatusRectum(
      semiMajorAxis,
      semiLatusRectum
    );

    //
  }, [ephemeridesQuery.data]);

  if (!ephemeridesQuery.data || !elements) {
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

  const bodyParams: BodyParams = {
    name: name,
    color: 'white',
    mass: physicalData.mass,
    meanRadius: physicalData.meanRadius / EARTH_RADIUS,
    // Reorder the components so that the the orbit lies in the XZ plane.
    initialPosition: vectorTable.position,
    initialVelocity: vectorTable.velocity,
  };

  // Destructure the orientation elements.
  const { longitudeOfAscendingNode, argumentOfPeriapsis, inclination } =
    elementTable;

  return (
    <object3D ref={orbitRef}>
      {/** Pass callback function down to orbiting body so that it will add itself to the tree.  */}
      {/* <KeplerTreeContext.Provider value={addChildToTree}> */}
      <Body ref={bodyRef} params={bodyParams} texture={texture}>
        {children}
      </Body>
      {/* </KeplerTreeContext.Provider> */}

      <Trajectory
        semiMajorAxis={semiMajorAxis}
        semiMinorAxis={semiMinorAxis}
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
