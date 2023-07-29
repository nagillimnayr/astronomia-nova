import {
  CameraControls,
  PerspectiveCamera as PerspectiveCam,
} from '@react-three/drei';
import { degToRad } from 'three/src/math/MathUtils';
import { useSelector } from '@xstate/react';
import { useContext, useRef } from 'react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { PerspectiveCamera } from 'three';
import { DIST_MULT, SUN_RADIUS } from '@/simulation/utils/constants';

const SpaceControls = () => {
  const { cameraService } = useContext(GlobalStateContext);
  const spaceView = useSelector(cameraService, (state) =>
    state.matches('space')
  );
  const cameraRef = useRef<PerspectiveCamera>(null!);

  return (
    <>
      <PerspectiveCam
        makeDefault={spaceView}
        name="Space-Camera"
        ref={(cam) => {
          const camera = cam as PerspectiveCamera;
          cameraRef.current = camera;

          if (camera === cameraService.machine.context.spaceCamera) return;
          // Assign camera to state context.
          cameraService.send({
            type: 'ASSIGN_SPACE_CAMERA',
            camera,
          });
        }}
        position={[0, 0, SUN_RADIUS / 10 / DIST_MULT + 1000]}
        near={1e-5}
        far={1e14}
      />
      <CameraControls
        makeDefault={spaceView}
        enabled={spaceView}
        camera={cameraRef.current}
        minDistance={1e-3}
        polarAngle={degToRad(60)}
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

export { SpaceControls };
