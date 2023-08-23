import { useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';

import {
  ImmersiveSessionOrigin,
  NonImmersiveCamera,
} from '@coconut-xr/natuerlich/react';
import { Group, PerspectiveCamera } from 'three';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';
import { Controllers } from '@coconut-xr/natuerlich/defaults';
import { useSelector } from '@xstate/react';

export const VRSessionOrigin = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const playerRef = useRef<Group>(null!);
  return (
    <>
      <ImmersiveSessionOrigin
        position={[0, 0, 0]}
        ref={(player) => {
          if (!player) return;
          playerRef.current = player;

          const controls = cameraActor.getSnapshot()!.context.controls;
          if (!controls) return;

          controls.attachToController(player);

          console.log('Attaching VR immersive origin to camera!', player);
          player.rotation.set(0, 0, 0);
        }}
      >
        <Controllers />
      </ImmersiveSessionOrigin>
    </>
  );
};
