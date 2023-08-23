import { VRControls } from './VRControls';
import { VRPlayer } from './VRPlayer';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { VRHUD } from '@/simulation/components/HUD/VR-HUD/VRHUD';
import { VRCameraManager } from './VRCameraManager';
import { useSessionChange, useXR } from '@coconut-xr/natuerlich/react';

import { FAR_CLIP, NEAR_CLIP } from '../scene-constants';

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
      <SessionInitializer />
    </>
  );
};

const SessionInitializer = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // const { session } = useXR();

  // useSessionChange(
  //   (newSession: XRSession | undefined, prevSession: XRSession | undefined) => {
  //     if (prevSession && !newSession) {
  //       // Session has ended.
  //       vrActor.send({ type: 'END_SESSION' });
  //       cameraActor.send({
  //         type: 'END_XR_SESSION',
  //       });
  //     }
  //     if (!prevSession && newSession) {
  //       // Session has started.
  //       vrActor.send({ type: 'START_SESSION' });
  //       cameraActor.send({
  //         type: 'START_XR_SESSION',
  //       });
  //       newSession
  //         .requestReferenceSpace(REF_SPACE_TYPE)
  //         .then((refSpace) => {
  //           // Assign the new reference space to the external state machines.
  //           cameraActor.send({
  //             type: 'ASSIGN_REF_SPACE',
  //             refSpace,
  //           });
  //           vrActor.send({
  //             type: 'ASSIGN_REF_SPACE_ORIGIN',
  //             refSpace,
  //           });
  //         })
  //         .catch((reason) => console.error(reason));
  //     }
  //   },
  //   []
  // );

  return (
    <>
      <></>
    </>
  );
};
