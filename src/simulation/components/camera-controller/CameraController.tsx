import { degToRad } from 'three/src/math/MathUtils';
import { SpaceCamera } from './SpaceCamera';
import { SurfaceCamera } from './SurfaceCamera';
import { CameraControls } from '@react-three/drei';
import { useContext } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { BaseInstance } from '@react-three/fiber';

const MIN_POLAR_ANGLE: Readonly<number> = degToRad(1);
const MAX_POLAR_ANGLE: Readonly<number> = degToRad(179);
const CameraController = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  return (
    <>
      <CameraControls
        makeDefault={true}
        minDistance={1e-5}
        polarAngle={degToRad(60)}
        minPolarAngle={MIN_POLAR_ANGLE}
        maxPolarAngle={MAX_POLAR_ANGLE}
        ref={(controls) => {
          if (!controls) {
            return;
          }

          console.assert(
            '__r3f' in controls,
            'Error: controls are not of type BaseInstance'
          );
          // Assign controls context in camera state machine.
          cameraActor.send({
            type: 'ASSIGN_CONTROLS',
            controls: controls as unknown as CameraControls & BaseInstance,
          });
        }}
      ></CameraControls>
      <SpaceCamera />
      <SurfaceCamera />
    </>
  );
};

export { CameraController };
