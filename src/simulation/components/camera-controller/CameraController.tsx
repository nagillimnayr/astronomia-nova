import { degToRad } from 'three/src/math/MathUtils';
import { SpaceControls } from './SpaceCamera';
import { SurfaceControls } from './SurfaceCamera';
import { CameraControls } from '@react-three/drei';
import { useContext } from 'react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';

const CameraController = () => {
  const { cameraService } = useContext(GlobalStateContext);
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
          cameraService.send({
            type: 'ASSIGN_CONTROLS',
            controls,
          });
        }}
      />
      <SpaceControls />
      <SurfaceControls />
    </>
  );
};

export { CameraController };
