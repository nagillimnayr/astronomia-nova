import { Object3D, type Vector3Tuple, Vector3, type Group } from 'three';

import { VRDebugFrustumDisplay } from './VRDebugFrustumDisplay';
import { VRDebugPoseDisplay } from './VRDebugPoseDisplay';
import { createPortal, useThree } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRDebugEventDisplay } from './VRDebugEventDisplay';

type VRDebugDisplayProps = {
  position?: Vector3Tuple;
  scale?: number;
};
export const VRDebugDisplay = ({
  position = [0, 0, 0],
  scale = 0.05,
}: VRDebugDisplayProps) => {
  const { vrActor } = MachineContext.useSelector(({ context }) => context);
  const inSession = useSelector(vrActor, (state) => state.matches('active'));
  return (
    <>
      <group
        visible={inSession} // Only visible when in XR session.
        position={position}
        scale={scale}
      >
        {/* <VRDebugPoseDisplay position={[0, 2.5, 0]} /> */}
        <VRDebugFrustumDisplay position={[0, -0.5, 0]} />
        <VRDebugEventDisplay position={[0, -3, 0]} />
      </group>
    </>
  );
};

export const VRDebugPortal = ({
  position = [0, 0, -1],
  scale = 0.15,
}: VRDebugDisplayProps) => {
  const camera = useThree(({ camera }) => camera);

  // Attach to the camera.
  return createPortal(
    <>
      <>
        <VRDebugDisplay position={position} scale={scale} />
      </>
    </>,
    camera
  );
};
