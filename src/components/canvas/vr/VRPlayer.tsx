import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect, useRef } from 'react';
import { Vector3, type Object3D } from 'three';
import { useSelector } from '@xstate/react';
import { degToRad } from 'three/src/math/MathUtils';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { useXR } from '@react-three/xr';
import { useThree } from '@react-three/fiber';
import { PI, PI_OVER_TWO } from '@/simulation/utils/constants';

const _cameraWorldDirection = new Vector3();
const _worldPos = new Vector3();
const _lookPos = new Vector3();

export const VRPlayer = () => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const getThree = useThree(({ get }) => get);
  const getXR = useXR(({ get }) => get);
  const player = useXR(({ player }) => player);
  const controllers = useXR(({ controllers }) => controllers);

  const cameraController = useSelector(
    cameraActor,
    ({ context }) => context.controls
  );

  useEffect(() => {
    if (!cameraController) return;
    const camera = cameraController.camera;
    if (!camera || !player) return;

    // Attach the player to the camera.
    cameraController.attachToController(player);

    console.log('Attaching VR Player to camera!', player);
    player.rotation.set(0, 0, 0);

    // Get controllers.
    const leftController = controllers.find(
      (controller) => controller.inputSource.handedness === 'left'
    );
    const rightController = controllers.find(
      (controller) => controller.inputSource.handedness === 'right'
    );
    console.log('left:', leftController);
    console.log('right:', rightController);
  }, [cameraController, controllers, getXR, player]);
  return <></>;
};

// const VRControllers = () => {
//   const { vrActor, cameraActor } = MachineContext.useSelector(
//     ({ context }) => context
//   );
//   const getXR = useXR(({ get }) => get);
//   const player = useXR(({ player }) => player);
//   const getThree = useThree(({ get }) => get);

// }
