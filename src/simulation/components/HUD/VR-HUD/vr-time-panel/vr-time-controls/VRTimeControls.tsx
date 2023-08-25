import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { colors, text } from '../../vr-hud-constants';
import { VRPauseButton } from './VRPauseButton';
import { VRTimescaleSlider } from './VRTimescaleSlider';
import { VRAdvanceTimeButton } from './VRAdvanceTimeButton';
import { Text } from '@react-three/drei';
import { type Vector3Tuple } from 'three';

type VRTimeControlProps = {
  position?: Vector3Tuple;
};
export const VRTimeControls = ({
  position = [0, 0, 0],
}: VRTimeControlProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <>
      <group position={position}>
        <VRAdvanceTimeButton position={[-2.5, 0, 0]} reverse />
        <VRPauseButton position={[0, 0, 0]} />
        <VRAdvanceTimeButton position={[2.5, 0, 0]} />
      </group>
    </>
  );
};
