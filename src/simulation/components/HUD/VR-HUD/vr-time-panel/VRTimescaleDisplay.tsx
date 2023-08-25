import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { colors, text } from '../vr-hud-constants';
import { useCallback } from 'react';
import { VRHudBGMaterial } from '../vr-materials/VRHudBGMaterial';
import { Text } from '@react-three/drei';
import { type Vector3Tuple } from 'three';

type VRTimescaleDisplayProps = {
  position?: Vector3Tuple;
};
export const VRTimescaleDisplay = ({
  position = [0, 0, 0],
}: VRTimescaleDisplayProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescale = useSelector(timeActor, ({ context }) => context.timescale);

  // Make plural if more than one.
  let str = `${timescale} hour`;
  if (Math.abs(timescale) > 1) {
    str += 's';
  }

  const fontSize = 1;
  return (
    <>
      <group position={position}>
        <Text fontSize={fontSize}>{str + ' / second'}</Text>
      </group>
    </>
  );
};
