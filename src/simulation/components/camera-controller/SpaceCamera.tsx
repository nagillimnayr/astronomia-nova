import {
  CameraControls,
  PerspectiveCamera as PerspectiveCam,
} from '@react-three/drei';
import { degToRad } from 'three/src/math/MathUtils';
import { useSelector } from '@xstate/react';
import { useContext, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type PerspectiveCamera } from 'three';
import { DIST_MULT, SUN_RADIUS } from '@/simulation/utils/constants';
import { FAR, NEAR } from '@/components/canvas/scene-constants';

const SpaceCamera = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const spaceView = useSelector(cameraActor, (state) => state.matches('space'));
  // const surfaceView = useSelector(cameraActor, (state) =>
  //   state.matches('surface')
  // );
  const cameraRef = useRef<PerspectiveCamera>(null!);

  return (
    <>
      <PerspectiveCam
        makeDefault={spaceView}
        name="Space-Camera"
        ref={(cam) => {
          if (!cam) return;
          const camera = cam as PerspectiveCamera;
          cameraRef.current = camera;

          // Assign camera to state context.
          cameraActor.send({
            type: 'ASSIGN_SPACE_CAMERA',
            camera,
          });
        }}
        position={[0, 0, SUN_RADIUS / 10 / DIST_MULT + 1000]}
        near={NEAR}
        far={FAR}
      />
    </>
  );
};

export { SpaceCamera };
