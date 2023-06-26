import { OrbitalElements } from '~/simulation/classes/OrbitalElements';
import { Trajectory } from './Trajectory/Trajectory';
import { useCallback, useContext, useMemo, useRef } from 'react';
import loadBodyPreset, { PresetKey } from '~/simulation/utils/loadBodyPreset';
import Body, { BodyArgs } from '../Body/Body';
import KeplerBody from '~/simulation/classes/KeplerBody';
import KeplerTreeContext from '~/simulation/context/KeplerTreeContext';
import { CentralMassContext } from '~/simulation/context/CentralMassContext';
import { calculateOrbitFromPeriapsis } from '~/simulation/math/orbit/calculateOrbit';
import { DIST_MULT } from '~/simulation/utils/constants';
import { TrueAnomalyArrow } from './arrows/TrueAnomalyArrow';
import {
  ColorRepresentation,
  Mesh,
  Object3D,
  Texture,
  Vector3,
  Vector3Tuple,
} from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { RetrogradeContext } from '../Retrograde/RetrogradeContext';
import { retrogradeState } from '../Retrograde/retrogradeState';
import { BodyMesh } from '../Body/BodyMesh';
import { getRadiusAtTrueAnomaly } from '~/simulation/math/orbital-elements/OrbitalRadius';
import {
  getOrbitalSpeedFromRadius,
  getVelocityDirectionAtRadius,
} from '~/simulation/math/orbital-elements/Velocity';
import {
  getPosition,
  getPositionFromRadius,
} from '~/simulation/math/orbital-elements/Position';

// Date needed by Orbit but not by Body
type OrbitData = {
  periapsis: number;
  maxVelocity: number;
  eccentricity: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  // longitudeOfPeriapsis: number;
  argumentOfPeriapsis: number;
  axialTilt: number;
  // meanLongitude: number;
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
  name: PresetKey;
  texture?: Texture;
};

export const Orbit = (props: OrbitProps) => {
  // get Central mass from parent
  const centralMass = useContext(CentralMassContext);

  const retrogradeContext = useContext(RetrogradeContext);

  // ref to Object3D
  const orbitRef = useRef<Object3D>(null!);

  // Note: create usePreset to get memoized preset data
  const preset = useMemo<PresetData>(
    () => loadBodyPreset(props.name),
    [props.name]
  );

  // derive the orbital elements from the periapsis and orbital speed at periapsis
  const elements = useMemo(
    () =>
      calculateOrbitFromPeriapsis(
        preset.periapsis * DIST_MULT,
        preset.maxVelocity * DIST_MULT,
        centralMass
      ),
    [preset.periapsis, preset.maxVelocity, centralMass]
  );

  const [initialPosition, initialVelocity] = useMemo(() => {
    // get orbital radius at true anomaly
    const radius = getRadiusAtTrueAnomaly(
      preset.trueAnomaly,
      elements.semiMajorAxis,
      elements.eccentricity
    );

    // get orbital speed at true anomaly
    const speed = getOrbitalSpeedFromRadius(
      radius,
      centralMass,
      elements.semiMajorAxis
    );

    // get position at true anomaly
    const initialPosition: Vector3 = new Vector3(
      ...getPositionFromRadius(radius, preset.trueAnomaly)
    ).divideScalar(DIST_MULT);

    // get velocity direction at true anomaly
    const velocityDirection: Vector3 = getVelocityDirectionAtRadius(
      radius,
      preset.trueAnomaly,
      elements.semiMajorAxis,
      elements.semiMinorAxis
    );
    const initialVelocity: Vector3 = velocityDirection
      .multiplyScalar(speed)
      .divideScalar(DIST_MULT);

    return [initialPosition, initialVelocity];
  }, [
    centralMass,
    elements.eccentricity,
    elements.semiMajorAxis,
    elements.semiMinorAxis,
    preset.trueAnomaly,
  ]);

  const bodyArgs = useMemo(() => {
    const bodyArgs: BodyArgs = {
      name: preset.name,
      color: preset.color,
      mass: preset.mass,
      meanRadius: preset.meanRadius,
      initialPosition: initialPosition,
      initialVelocity: initialVelocity,
    };
    return bodyArgs;
  }, [
    initialPosition,
    initialVelocity,
    preset.color,
    preset.mass,
    preset.meanRadius,
    preset.name,
  ]);

  const bodyRef = useRef<KeplerBody>(null!);
  const meshRef = useRef<Mesh>(null!);

  // callback function to be passed down to children via context provider
  // the child will call it within a callback ref and pass their reference
  // as the argument, where it will be used to construct the Kepler Tree
  const addChildToTree = useCallback((body: KeplerBody) => {
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
  }, []);

  return (
    <object3D
      ref={(orbit) => {
        if (!orbit) return;
        orbitRef.current = orbit;
        orbit.rotateY(degToRad(preset.longitudeOfAscendingNode));
        orbit.rotateX(degToRad(preset.inclination));
        orbit.rotateY(degToRad(preset.argumentOfPeriapsis));
      }}
    >
      <KeplerTreeContext.Provider value={addChildToTree}>
        <Body ref={bodyRef} args={bodyArgs}>
          {props.children}
        </Body>
        <BodyMesh
          name={props.name}
          meanRadius={preset.meanRadius}
          color={preset.color}
          texture={props.texture}
          body={bodyRef}
        />
      </KeplerTreeContext.Provider>
      <Trajectory
        semiMajorAxis={elements.semiMajorAxis}
        semiMinorAxis={elements.semiMinorAxis}
      />
      <TrueAnomalyArrow color={preset.color} target={bodyRef} />
    </object3D>
  );
};
