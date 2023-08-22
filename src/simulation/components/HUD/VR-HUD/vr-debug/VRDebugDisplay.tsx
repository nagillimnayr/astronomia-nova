import { Object3D, type Vector3Tuple, Vector3, type Group } from 'three';

import { VRDebugFrustumDisplay } from './VRDebugFrustumDisplay';
import { VRDebugPoseDisplay } from './VRDebugPoseDisplay';
import { createPortal, useThree } from '@react-three/fiber';

type VRDebugDisplayProps = {
  position?: Vector3Tuple;
  scale?: number;
};
export const VRDebugDisplay = ({
  position = [0, 0, 0],
  scale = 0.05,
}: VRDebugDisplayProps) => {
  return (
    <>
      <group position={position} scale={scale}>
        <VRDebugPoseDisplay position={[0, 2.5, 0]} />
        <VRDebugFrustumDisplay position={[0, -0.5, 0]} />
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
