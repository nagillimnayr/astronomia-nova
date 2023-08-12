import {
  PerspectiveCamera as PerspectiveCam,
  useHelper,
} from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { useContext, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { CameraHelper, type PerspectiveCamera } from 'three';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';

const SurfaceCamera = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const surfaceView = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );
  // const spaceView = useSelector(cameraActor, (state) =>
  //   state.matches('space')
  // );
  const cameraRef = useRef<PerspectiveCamera>(null!);
  // useHelper(cameraRef, CameraHelper);
  return (
    <>
      <PerspectiveCam
        makeDefault={surfaceView}
        name="Surface-Camera"
        position={[0, 0, -1e-3]}
        rotation={[0, 0, 0]}
        ref={(cam) => {
          if (!cam) return;
          const camera = cam as PerspectiveCamera;
          cameraRef.current = camera;
          // Assign camera to state context.
          cameraActor.send({ type: 'ASSIGN_SURFACE_CAMERA', camera });
        }}
        near={NEAR_CLIP}
        far={FAR_CLIP}
        fov={50}
      />
    </>
  );
};

export { SurfaceCamera };
