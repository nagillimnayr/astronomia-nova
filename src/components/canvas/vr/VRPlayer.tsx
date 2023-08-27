import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect, useMemo, useRef } from 'react';
import { Vector3, type Object3D, Line } from 'three';
import { useSelector } from '@xstate/react';
import { degToRad } from 'three/src/math/MathUtils';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { Controllers, useController, useXR } from '@react-three/xr';
import { useThree } from '@react-three/fiber';
import { PI, PI_OVER_TWO } from '@/simulation/utils/constants';
import { VRHoverIndicator } from './VRHoverIndicator';

const _cameraWorldDirection = new Vector3();
const _worldPos = new Vector3();
const _lookPos = new Vector3();

export const VRPlayer = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const player = useXR(({ player }) => player);
  const isPresenting = useXR(({ isPresenting }) => isPresenting);
  const session = useXR(({ session }) => session);

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
      {isPresenting && (
        <>
          <Controllers />
          <VRHoverIndicator handedness="left" />
          <VRHoverIndicator handedness="right" />
        </>
      )}
    </>
  );
};
