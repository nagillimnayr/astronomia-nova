import { OrbitalElements } from '~/simulation/classes/OrbitalElements';
import { Trajectory } from './Trajectory/Trajectory';
import { useCallback, useContext, useMemo } from 'react';
import loadBodyPreset, { PresetKey } from '~/simulation/utils/loadBodyPreset';
import Body, { BodyAttributes } from '../Body/Body';
import KeplerBody from '~/simulation/classes/KeplerBody';
import KeplerTreeContext from '~/simulation/context/KeplerTreeContext';
import { CentralMassContext } from '~/simulation/context/CentralMassContext';
import { calculateOrbitFromPeriapsis } from '~/simulation/math/orbit/calculateOrbit';

type OrbitProps = {
  children?: React.ReactNode;
  name: PresetKey;
  texturePath: string;
};

export const Orbit = (props: OrbitProps) => {
  const centralMass = useContext(CentralMassContext);

  // Note: create usePreset to get memoized preset data
  const preset = useMemo<BodyAttributes>(
    () => loadBodyPreset(props.name),
    [props.name]
  );

  const elements = useMemo(
    () =>
      calculateOrbitFromPeriapsis(
        preset.initialPosition,
        preset.initialVelocity,
        centralMass
      ),
    []
  );

  // callback function to be passed down to children via context provider
  // the child will call it within a callback ref and pass their reference
  // as the argument, where it will be used to construct the Kepler Tree
  const addChildToTree = useCallback((body: KeplerBody) => {
    if (!body) {
      return;
    }

    // setup attachment to parent
    const parent: KeplerBody = body.parent as KeplerBody;
    console.assert(parent, 'failed to cast to parent');
    parent.addOrbitingBody(body);
  }, []);

  return (
    <>
      <KeplerTreeContext.Provider value={addChildToTree}>
        <Body args={preset} texturePath={props.texturePath}>
          {props.children}
        </Body>
      </KeplerTreeContext.Provider>
      <Trajectory
        semiMajorAxis={elements.semiMajorAxis}
        semiMinorAxis={elements.semiMinorAxis}
      />
    </>
  );
};
