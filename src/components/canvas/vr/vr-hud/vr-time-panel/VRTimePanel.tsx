import { VRTimeControls } from '@/components/canvas/vr/vr-hud/vr-time-panel/vr-time-controls/VRTimeControls';
import { VRDateDisplay } from '@/components/canvas/vr/vr-hud/vr-time-panel/vr-time-display/VRDateDisplay';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, Vector3, Vector3Tuple } from 'three';
import { GOLDEN_RATIO } from '../../../../../constants/vr-hud-constants';

const _camWorldPos = new Vector3();
const _camWorldUp = new Vector3();

type VRTimePanelProps = {
  position?: Vector3Tuple;
  scale?: number;
};
export const VRTimePanel = ({
  position = [0, 0, 0],
  scale = 1,
}: VRTimePanelProps) => {
  // Get actors from root state machine.
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const getThree = useThree(({ get }) => get);

  // Get refs to root container and object.
  const containerRef = useRef<Group>(null!);

  const height = 1;
  const width = height * GOLDEN_RATIO;
  return (
    <>
      <group
        position={position}
        ref={containerRef}
        name="vr-time-panel"
        scale={scale}
      >
        {/* <VRTimescaleDisplay position={[0, 4, 0]} /> */}
        <VRDateDisplay position={[0, 2.25, 0]} />
        <VRTimeControls position={[0, -2.25, 0]} />
      </group>
    </>
  );
};
