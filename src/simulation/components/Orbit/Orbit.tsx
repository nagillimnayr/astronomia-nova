import { Trajectory } from './Trajectory/Trajectory';
import { useCallback, useContext, useMemo, useRef } from 'react';
import loadBodyPreset, { PresetKey } from '@/simulation/utils/loadBodyPreset';
import Body, { BodyParams } from '../Body/Body';
import KeplerBody from '@/simulation/classes/KeplerBody';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { CentralMassContext } from '@/simulation/context/CentralMassContext';
import { calculateOrbitFromPeriapsis } from '@/simulation/math/orbit/calculateOrbit';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { TrueAnomalyArrow } from './arrows/TrueAnomalyArrow';
import {
  ColorRepresentation,
  Matrix4,
  Mesh,
  Object3D,
  Texture,
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

// Data needed by Orbit but not by Body
type OrbitData = {
  periapsis: number;
  maxVelocity: number;
  eccentricity: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
  axialTilt: number;
  trueAnomaly: number;
};

type BodyData = {
  name: string;
  color: ColorRepresentation;
  mass: number;
  meanRadius: number;
};

// intersection type to combine the data needed by Orbit and the data needed by Body
type PresetData = OrbitData & BodyData;

type OrbitProps = {
  children?: React.ReactNode;
  name: BodyKey;
  texture?: Texture;
};

export const Orbit = ({ children, name, texture }: OrbitProps) => {
  // get Central mass from parent
  const centralMass = useContext(CentralMassContext);

  const retrogradeContext = useContext(RetrogradeContext);

  // ref to Object3D
  const orbitRef = useRef<Object3D>(null!);
  // reference to orbiting body
  const bodyRef = useRef<KeplerBody>(null!);

  // callback function to be passed down to children via context provider
  // the child will call it within a callback ref and pass their reference
  // as the argument, where it will be used to construct the Kepler Tree
  const addChildToTree = useCallback(
    (body: KeplerBody) => {
      if (!body) {
        return;
      }

      // setup attachment to central body
      if (!body.parent) return;
      // go up by two levels to get to the parent body
      const parent: KeplerBody = body.parent.parent as KeplerBody;
      console.assert(parent, 'failed to cast to parent');
      parent.addOrbitingBody(body);

      if (retrogradeContext === 'referenceBody') {
        retrogradeState.setReferenceBody(body);
      }
      if (retrogradeContext === 'otherBody') {
        retrogradeState.setOtherBody(body);
      }
    },
    [retrogradeContext]
  );

  // const urlParams = useMemo(() => {
  //   const urlParams = new URLSearchParams({
  //     name: name,
  //   });
  //   return urlParams;
  // }, [name]);
  // const { isLoading, error, data } = useQuery({
  //   queryKey: [''],
  //   queryFn: () => {
  //     return fetch(`/horizons/load-ephemerides?${urlParams.toString()}`)
  //       .then((res) => res.json())
  //       .catch((reason) => {
  //         console.error(reason);
  //       });
  //   },
  // });

  const ephemeridesQuery = trpc.loadEphemerides.useQuery({ name: name });
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

  const bodyParams: BodyParams = {
    name: name,
    color: '#ffffff',
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
    <object3D
      ref={(orbit) => {
        if (!orbit) return;
        orbitRef.current = orbit;
        // rotate to orient the orbit
        // orbit.rotateY(degToRad(elementTable.longitudeOfAscendingNode));
        // orbit.rotateX(degToRad(elementTable.inclination));
        // orbit.rotateY(degToRad(elementTable.argumentOfPeriapsis));
      }}
    >
      {/** pass callback function down to orbiting body so that it will add itself to the tree  */}
      <KeplerTreeContext.Provider value={addChildToTree}>
        <Body ref={bodyRef} params={bodyParams} texture={texture}>
          {children}
        </Body>
      </KeplerTreeContext.Provider>

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
