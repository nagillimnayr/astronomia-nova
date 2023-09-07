import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect } from 'react';
import { Vector3 } from 'three';
import { Controllers, useXR } from '@react-three/xr';
import { VRControllerRay } from './VRControllerRay';

const _cameraWorldDirection = new Vector3();
const _worldPos = new Vector3();
const _lookPos = new Vector3();

export const VRPlayer = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const player = useXR(({ player }) => player);
  const isPresenting = useXR(({ isPresenting }) => isPresenting);
  // const session = useXR(({ session }) => session);

  useEffect(() => {
    const { controls } = cameraActor.getSnapshot()!.context;
    if (!controls || !isPresenting) return;
    const camera = controls.camera;
    if (!camera || !player) return;
    player.name = 'vr-player';
    // Attach the player to the camera.
    controls.attachToController(player);

    console.log('Attaching VR Player to camera!', player);
    player.rotation.set(0, 0, 0);
  }, [cameraActor, isPresenting, player]);
  return (
    <>
      <>
        <Controllers />
        {/* <Hands /> */}

        <VRControllerRay handedness="left" />
        <VRControllerRay handedness="right" />
      </>
    </>
  );
};
