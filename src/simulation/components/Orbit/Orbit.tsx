import { OrbitalElements } from '~/simulation/classes/OrbitalElements';
import { Trajectory } from './Trajectory/Trajectory';
import { useMemo } from 'react';
import loadBodyPreset, { PresetKey } from '~/simulation/utils/loadBodyPreset';
import { BodyAttributes } from '../Body/Body';

type OrbitProps = {
  children: React.ReactNode;
  name: PresetKey;
};

export const Orbit = (props: OrbitProps) => {
  const preset = useMemo<BodyAttributes>(
    () => loadBodyPreset(props.name),
    [props.name]
  );

  return (
    <>
      <object3D>
        <Trajectory />
      </object3D>
    </>
  );
};
