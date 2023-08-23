import { useSelector } from '@xstate/react';
import { useContext, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type PerspectiveCamera } from 'three';
import { DIST_MULT, SUN_RADIUS } from '@/simulation/utils/constants';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';
import { NonImmersiveCamera } from '@coconut-xr/natuerlich/react';

export const MainCamera = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Bind to state changes so the camera will reset itself when a session starts or ends.
  const vrActive = useSelector(vrActor, (state) => state.matches('active'));

  return (
    <>
      <NonImmersiveCamera
        name="main-camera"
        position={[0, 0, 0]}
        near={NEAR_CLIP}
        far={FAR_CLIP}
        ref={(camera) => {
          if (!camera) return;

          setTimeout(() => {
            cameraActor.send({
              type: 'ASSIGN_CAMERA',
              camera,
            });
          }, 200);
        }}
      ></NonImmersiveCamera>
    </>
  );
};
