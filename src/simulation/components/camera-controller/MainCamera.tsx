import { useSelector } from '@xstate/react';
import { useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { PerspectiveCamera } from 'three';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';
import { PerspectiveCamera as PerspectiveCam } from '@react-three/drei';

export const MainCamera = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Bind to state changes so the camera will reset itself when a session starts or ends.
  const vrActive = useSelector(vrActor, (state) => state.matches('active'));

  const camRef = useRef<PerspectiveCamera>(null!);
  return (
    <>
      <PerspectiveCam
        makeDefault
        name="main-camera"
        position={[0, 0, 0]}
        near={NEAR_CLIP}
        far={FAR_CLIP}
        ref={(camera) => {
          if (!(camera instanceof PerspectiveCamera)) return;
          // if (camRef.current === camera) return;
          camRef.current = camera;
          console.log('hello');
          cameraActor.send({
            type: 'ASSIGN_CAMERA',
            camera,
          });
        }}
      ></PerspectiveCam>
    </>
  );
};
