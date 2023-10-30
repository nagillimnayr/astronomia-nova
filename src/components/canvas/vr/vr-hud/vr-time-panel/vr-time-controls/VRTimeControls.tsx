import { Interactive } from '@react-three/xr';
import { type Vector3Tuple } from 'three';
import { depth } from '../../../../../../constants/vr-hud-constants';
import { VRPanel } from '../../vr-ui-components/vr-panel/VRPanel';
import { VRAdvanceTimeButton } from './VRAdvanceTimeButton';
import { VRPauseButton } from './VRPauseButton';
import { VRTimescaleSlider } from './VRTimescaleSlider';
import { VRTimescaleDisplay } from '../vr-time-display/VRTimescaleDisplay';
import { VRTimescaleIncrementButton } from './VRTimescaleIncrementButton';
import { VRTimescaleUnitIncrementButton } from './VRTimescaleUnitIncrementButton';

// Dummy function for passing to Interactive so it will catch intersections.
const dummyFn = () => {
  return;
};

const BUTTON_X_OFFSET = 5;
const BUTTON_SCALE = 0.5;

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
            <VRPanel width={3.5} height={1.5} />
          </object3D>
        </Interactive>
        <group position-z={depth.xs} position-y={0.5}>
          <group position-y={1} scale={0.8}>
            {/** Sidereal Day Reverse Button. */}
            <VRAdvanceTimeButton position={[-2.5, 0, 0]} reverse />

            {/** Pause/Play Button. */}
            <VRPauseButton position={[0, 0, 0]} />

            {/** Sidereal Day Advance Button. */}
            <VRAdvanceTimeButton position={[2.5, 0, 0]} />
          </group>

          <group position-y={-1.5} position-z={depth.xs}>
            {/* Timescale Units. */}
            <group position-y={0.75}>
              <object3D position-x={-BUTTON_X_OFFSET} scale={BUTTON_SCALE}>
                <VRTimescaleUnitIncrementButton reverse={true} />
              </object3D>
              <VRTimescaleDisplay />
              <object3D position-x={BUTTON_X_OFFSET} scale={BUTTON_SCALE}>
                <VRTimescaleUnitIncrementButton reverse={false} />
              </object3D>
            </group>

            {/* Timescale slider. */}
            <group position-y={-0.75}>
              <object3D position-x={-BUTTON_X_OFFSET} scale={BUTTON_SCALE}>
                <VRTimescaleIncrementButton reverse={true} />
              </object3D>
              <VRTimescaleSlider />
              <object3D position-x={BUTTON_X_OFFSET} scale={BUTTON_SCALE}>
                <VRTimescaleIncrementButton reverse={false} />
              </object3D>
            </group>
          </group>
        </group>
      </group>
    </>
  );
};
