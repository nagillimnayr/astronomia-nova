import { useController, useXR, useXREvent } from '@react-three/xr';
import { VRControls } from './VRControls';
import { VRPlayer } from './VRPlayer';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { VRHUD } from '@/simulation/components/HUD/VR-HUD/VRHUD';
import { VRCameraManager } from './VRCameraManager';

export const VRManager = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // const getXR = useXR(({ get }) => get);
  const getThree = useThree(({ get }) => get);

  // useEffect(() => {
  //   cameraActor.send({ type: 'ASSIGN_GET_XR', getXR });
  //   vrActor.send({ type: 'ASSIGN_GET_XR', getXR });
  // }, [cameraActor, getXR, vrActor]);
  useEffect(() => {
    cameraActor.send({ type: 'ASSIGN_GET_THREE', getThree: getThree });
    vrActor.send({ type: 'ASSIGN_GET_THREE', getThree: getThree });
  }, [cameraActor, getThree, vrActor]);

  useFrame((state, delta, frame) => {
    const { gl } = state;
    const { xr } = gl;
    if (!xr.enabled) return;

    if (!(frame instanceof XRFrame)) return;

    // Get reference space.
    const { refSpaceOrigin } = vrActor.getSnapshot()!.context;
    if (!refSpaceOrigin) return;
    // Get viewer pose.
    const pose = frame.getViewerPose(refSpaceOrigin);
    if (!pose) return;
    // Send pose to vrActor.
    vrActor.send({ type: 'ASSIGN_POSE', pose });
  });

  return (
    <>
      <VRControls />
      {/* <VRPlayer /> */}
    </>
  );
};
