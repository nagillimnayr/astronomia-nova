import {
  PerspectiveCamera as PerspectiveCam,
  useHelper,
} from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { useContext, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { CameraHelper, type PerspectiveCamera } from 'three';

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
        near={1e-5}
        far={1e9}
        fov={20}
      />
    </>
  );
};

export { SurfaceCamera };
