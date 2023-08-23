import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect, useRef } from 'react';
import { Vector3, type Object3D } from 'three';
import { useSelector } from '@xstate/react';
import { degToRad } from 'three/src/math/MathUtils';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { useXR } from '@react-three/xr';
import { useThree } from '@react-three/fiber';

const _cameraWorldDirection = new Vector3();
const _worldPos = new Vector3();
const _lookPos = new Vector3();

export const VRPlayer = () => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const getXR = useXR(({ get }) => get);
  const player = useXR(({ player }) => player);
  const getThree = useThree(({ get }) => get);
  const objRef = useRef<Object3D>(null!);

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
    camera.getWorldDirection(_cameraWorldDirection);
    player.up.set(...getLocalUpInWorldCoords(camera));
    player.getWorldPosition(_worldPos);
    _lookPos.addVectors(_worldPos, _cameraWorldDirection);
    player.lookAt(_lookPos);
    console.log('Attaching VR Player to camera!');
  }, [cameraController, player]);
  return <></>;
};
