import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import {
  PerspectiveCamera as PerspectiveCam,
  useHelper,
} from '@react-three/drei';
import { useContext, useRef } from 'react';
import { CameraHelper, type Object3D, type PerspectiveCamera } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const Observer = () => {
  const { cameraService } = useContext(GlobalStateContext);
  const cameraRef = useRef<PerspectiveCamera>(null!);
  useHelper(cameraRef, CameraHelper);
  return (
    <>
      <object3D>
        <object3D rotation={[0, 0, -degToRad(90)]}>
          <PerspectiveCam
            ref={(cam) => {
              if (!cam) return;
              const camera = cam as PerspectiveCamera;
              cameraRef.current = camera;
              // Assign camera to state context.
              console.log('surfaceCam', camera);
              cameraService.send({ type: 'ASSIGN_SURFACE_CAMERA', camera });
            }}
            near={1e-5}
            far={1e5}
            fov={15}
          />
        </object3D>
        <axesHelper args={[3e-2]} />
      </object3D>
    </>
  );
};

export { Observer };
