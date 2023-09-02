import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { colors, depth, text } from '../../vr-hud-constants';
import { VRPauseButton } from './VRPauseButton';
import { VRTimescaleSlider } from './VRTimescaleSlider';
import { VRAdvanceTimeButton } from './VRAdvanceTimeButton';
import { Text } from '@react-three/drei';
import { type Vector3Tuple } from 'three';
import { VRTimescaleIncrementButton } from './VRTimescaleIncrementButton';
import { VRPanel } from '../../vr-ui-components/VRPanel';

type VRTimeControlProps = {
  position?: Vector3Tuple;
  scale?: number;
};
export const VRTimeControls = ({
  position = [0, 0, 0],
  scale,
}: VRTimeControlProps) => {
  // const { timeActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <>
      <group position={position} scale={scale}>
        <object3D scale={4}>
          <VRPanel width={3} height={1.2} />
        </object3D>
        <group position-z={depth.xxs}>
          <group position-y={1} scale={0.8}>
            {/** Sidereal Day Reverse Button. */}
            <VRAdvanceTimeButton position={[-2.5, 0, 0]} reverse />

            {/** Pause/Play Button. */}
            <VRPauseButton position={[0, 0, 0]} />

            {/** Sidereal Day Advance Button. */}
            <VRAdvanceTimeButton position={[2.5, 0, 0]} />
          </group>
          <group position-y={-0.75}>
            <VRTimescaleSlider />
          </group>
        </group>
      </group>
    </>
  );
};
