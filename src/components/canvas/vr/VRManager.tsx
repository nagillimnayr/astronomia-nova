import { useController, useXR, useXREvent } from '@react-three/xr';
import { PlayerControls } from './PlayerControls';
import { VRPlayer } from './VRPlayer';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect } from 'react';

export const VRManager = () => {
  const { player, isPresenting, session, controllers, get } = useXR();
  const rightController = useController('right');
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  useEffect(() => {
    cameraActor.send({ type: 'ASSIGN_GET_XR', getXR: get });
  }, [cameraActor, get]);

  useXREvent(
    'squeeze',
    (event) => {
      console.log('player position:', player.position.toArray());
      console.log('player', player);
      console.log('event', event);
    },
    { handedness: 'right' }
  );

  return (
    <>
      <PlayerControls />
      <VRPlayer />
    </>
  );
};
