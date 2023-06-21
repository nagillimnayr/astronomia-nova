import { OrbitalElements } from '~/simulation/classes/OrbitalElements';
import { Trajectory } from './Trajectory/Trajectory';
import { useCallback, useContext, useMemo, useRef } from 'react';
import loadBodyPreset, { PresetKey } from '~/simulation/utils/loadBodyPreset';
import Body, { BodyAttributes } from '../Body/Body';
import KeplerBody from '~/simulation/classes/KeplerBody';
import KeplerTreeContext from '~/simulation/context/KeplerTreeContext';
import { CentralMassContext } from '~/simulation/context/CentralMassContext';
import { calculateOrbitFromPeriapsis } from '~/simulation/math/orbit/calculateOrbit';
import { DIST_MULT } from '~/simulation/utils/constants';
import { TrueAnomalyArrow } from './arrows/TrueAnomalyArrow';
import { Object3D } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { RetrogradeContext } from '../Retrograde/RetrogradeContext';
import { retrogradeState } from '../Retrograde/retrogradeState';

// Date needed by Orbit but not by Body
type OrbitData = {
  eccentricity: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  longitudeOfPeriapsis: number;
  argumentOfPeriapsis: number;
  axialTilt: number;
};

// intersection type to combine the data needed by Orbit and the data needed by Body
type PresetData = OrbitData & BodyAttributes;

type OrbitProps = {
  children?: React.ReactNode;
  name: PresetKey;
  texturePath: string;
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

  const elements = useMemo(
    () =>
      calculateOrbitFromPeriapsis(
        preset.initialPosition * DIST_MULT,
        preset.initialVelocity * DIST_MULT,
        centralMass
      ),
    [preset.initialPosition, preset.initialVelocity, centralMass]
  );

  const bodyRef = useRef<KeplerBody>(null!);
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
        <Body ref={bodyRef} args={preset} texturePath={props.texturePath}>
          {props.children}
        </Body>
      </KeplerTreeContext.Provider>
      <Trajectory
        semiMajorAxis={elements.semiMajorAxis}
        semiMinorAxis={elements.semiMinorAxis}
      />
      <TrueAnomalyArrow color={preset.color} target={bodyRef} />
    </object3D>
  );
};
