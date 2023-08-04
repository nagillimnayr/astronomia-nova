import { degToRad } from 'three/src/math/MathUtils';
import { SpaceCamera } from './SpaceCamera';
import { SurfaceCamera } from './SurfaceCamera';
import { CameraControls } from '@react-three/drei';
import { useContext } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';

const CameraController = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  return (
    <>
      <CameraControls
        makeDefault={true}
        minDistance={1e-5}
        polarAngle={degToRad(60)}
        ref={(controls) => {
          if (!controls) {
            return;
          }

          // Assign controls context in camera state machine.
          cameraActor.send({
            type: 'ASSIGN_CONTROLS',
            controls,
          });
        }}
      />
      <SpaceCamera />
      <SurfaceCamera />
    </>
  );
};

export { CameraController };
