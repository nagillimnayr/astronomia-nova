import { useController, useXR, useXREvent } from '@react-three/xr';
import { VRControls } from './VRControls';
import { VRPlayer } from './VRPlayer';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export const VRManager = () => {
  const getXR = useXR(({ get }) => get);
  const rightController = useController('right');
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const getThree = useThree(({ get }) => get);
  useEffect(() => {
    cameraActor.send({ type: 'ASSIGN_GET_XR', getXR });
    vrActor.send({ type: 'ASSIGN_GET_XR', getXR });
  }, [cameraActor, getXR, vrActor]);
  useEffect(() => {
    cameraActor.send({ type: 'ASSIGN_GET_THREE', getThree: getThree });
    vrActor.send({ type: 'ASSIGN_GET_THREE', getThree: getThree });
  }, [cameraActor, getThree, vrActor]);
  useEffect(() => {
    const xr = getThree().gl.xr;
    if (!xr) return;
    vrActor.send({ type: 'ASSIGN_XR_MANAGER', xr });
  }, [getThree, vrActor]);
  return (
    <>
      <VRControls />
      <VRPlayer />
    </>
  );
};
