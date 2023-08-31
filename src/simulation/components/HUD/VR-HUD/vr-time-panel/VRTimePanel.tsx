import { Suspense, useEffect, useRef } from 'react';
import { GOLDEN_RATIO, PRECISION, colors, text } from '../vr-hud-constants';
import { VRDateDisplay } from './VRDateDisplay';
import { VRTimeControls } from './vr-time-controls/VRTimeControls';
import { VRTimescaleDisplay } from './VRTimescaleDisplay';
import { VRTimescaleSlider } from './vr-time-controls/VRTimescaleSlider';
import { Object3D, Vector3Tuple, Vector3, Group } from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useThree } from '@react-three/fiber';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { useSelector } from '@xstate/react';
import { PI } from '../../../../utils/constants';

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
      {/** Its better to put the object3D outside of the Suspense barrier, so as to not delay setting the reference. */}
      <group
        position={position}
        ref={containerRef}
        name="vr-time-panel"
        scale={scale}
      >
        <VRTimescaleDisplay position={[0, 4, 0]} />
        <VRDateDisplay position={[0, 2, 0]} />
        <VRTimeControls position={[0, -1.5, 0]} />
        {/* <VRTimescaleSlider position={[0, -1.5, 0]} /> */}
        {/* <axesHelper args={[2]} /> */}
      </group>
    </>
  );
};
