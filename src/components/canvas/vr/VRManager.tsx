import { MachineContext } from '@/state/xstate/MachineProviders';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useVRControls } from './vr-controls/useVRControls';
import { VRPlayer } from './VRPlayer';
import { useXR } from '@react-three/xr';
import { useVRTicker } from './hooks/useVRTicker';

export const VRManager = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const getXR = useXR(({ get }) => get);
  const getThree = useThree(({ get }) => get);

  useEffect(() => {
    cameraActor.send({ type: 'ASSIGN_GET_THREE', getThree: getThree });
    vrActor.send({ type: 'ASSIGN_GET_THREE', getThree: getThree });
  }, [cameraActor, getThree, vrActor]);

  useFrame(({ gl }) => {
    if (!getXR().isPresenting) return;
    const frame = gl.xr.getFrame();

    // Pass frame to vrActor.
    vrActor.send({ type: 'UPDATE', frame });
  });

  /* Necessary to update GSAP animations when in VR. */
  useVRTicker();

  useVRControls();

  return (
    <>
      <VRPlayer />
    </>
  );
};
