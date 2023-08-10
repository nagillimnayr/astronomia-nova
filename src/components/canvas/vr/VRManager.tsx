import { useController, useXR, useXREvent } from '@react-three/xr';
import { PlayerControls } from './PlayerControls';
import { VRPlayer } from './VRPlayer';

export const VRManager = () => {
  const { player, isPresenting, session, controllers } = useXR();
  const rightController = useController('right');

  useXREvent(
    'squeeze',
    (event) => {
      // player.position.set(-1e4, 0, 0);
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
