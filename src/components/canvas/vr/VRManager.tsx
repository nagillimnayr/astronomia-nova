import { VRControls } from './vr-controls/VRControls';
import { VRPlayer } from './VRPlayer';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { VRCameraManager } from './VRCameraManager';
import { VRHoverIndicator } from './VRHoverIndicator';

export const VRManager = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // const getXR = useXR(({ get }) => get);
  const getThree = useThree(({ get }) => get);

  useEffect(() => {
    cameraActor.send({ type: 'ASSIGN_GET_THREE', getThree: getThree });
    vrActor.send({ type: 'ASSIGN_GET_THREE', getThree: getThree });
  }, [cameraActor, getThree, vrActor]);

  useFrame((state, delta, frame) => {
    if (!(frame instanceof XRFrame)) return;

    // Pass frame to vrActor.
    vrActor.send({ type: 'UPDATE', frame });
  });

  return (
    <>
      <VRControls />
      <VRPlayer />

      <VRHoverIndicator handedness="left" />
      <VRHoverIndicator handedness="right" />
    </>
  );
};
