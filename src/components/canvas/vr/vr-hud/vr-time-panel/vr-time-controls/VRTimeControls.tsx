import { Interactive } from '@react-three/xr';
import { type Vector3Tuple } from 'three';
import { depth } from '../../../../../../constants/vr-hud-constants';
import { VRPanel } from '../../vr-ui-components/vr-panel/VRPanel';
import { VRAdvanceTimeButton } from './VRAdvanceTimeButton';
import { VRPauseButton } from './VRPauseButton';
import { VRTimescaleSlider } from './VRTimescaleSlider';

// Dummy function for passing to Interactive so it will catch intersections.
const dummyFn = () => {
  return;
};

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
        <Interactive onSelect={dummyFn}>
          <object3D scale={4}>
            <VRPanel width={3} height={1.2} />
          </object3D>
        </Interactive>
        <group position-z={depth.xs}>
          <group position-y={1} scale={0.8}>
            {/** Sidereal Day Reverse Button. */}
            <VRAdvanceTimeButton position={[-2.5, 0, 0]} reverse />

            {/** Pause/Play Button. */}
            <VRPauseButton position={[0, 0, 0]} />

            {/** Sidereal Day Advance Button. */}
            <VRAdvanceTimeButton position={[2.5, 0, 0]} />
          </group>
          <group position-y={-0.75} position-z={depth.xs}>
            <VRTimescaleSlider />
          </group>
        </group>
      </group>
    </>
  );
};