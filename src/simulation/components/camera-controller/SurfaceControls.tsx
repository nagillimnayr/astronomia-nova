import {
  CameraControls,
  PerspectiveCamera as PerspectiveCam,
  PointerLockControls,
  useHelper,
} from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { useContext, useRef } from 'react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { CameraHelper, type PerspectiveCamera } from 'three';

const SurfaceControls = () => {
  const { cameraService } = useContext(GlobalStateContext);
  const surfaceView = useSelector(cameraService, (state) =>
    state.matches('surface')
  );
  const cameraRef = useRef<PerspectiveCamera>(null!);
  useHelper(cameraRef, CameraHelper);
  return (
    <>
      <PerspectiveCam
        makeDefault={surfaceView}
        name="Surface-Camera"
        ref={(cam) => {
          if (!cam) return;
          const camera = cam as PerspectiveCamera;
          cameraRef.current = camera;
          // Assign camera to state context.
          if (camera === cameraService.machine.context.surfaceCamera) return;
          cameraService.send({ type: 'ASSIGN_SURFACE_CAMERA', camera });
        }}
        near={1e-6}
        far={1e5}
        fov={20}
      />
      {/* <PointerLockControls
        makeDefault={surfaceView}
        enabled={surfaceView}
        camera={cameraRef.current}
        ref={(controls) => {
          if (!controls) return;
          cameraService.send({ type: 'ASSIGN_SURFACE_CONTROLS', controls });
        }}
      /> */}
      <CameraControls
        makeDefault={surfaceView}
        enabled={surfaceView}
        camera={cameraRef.current}
        minDistance={1e-3}
        maxDistance={1e-3}
        // polarAngle={degToRad(60)}
        ref={(controls) => {
          if (!controls) {
            return;
          }

          // Assign controls context in camera state machine.
          cameraService.send({
            type: 'ASSIGN_SPACE_CONTROLS',
            controls,
          });
        }}
      />
    </>
  );
};

export { SurfaceControls };
