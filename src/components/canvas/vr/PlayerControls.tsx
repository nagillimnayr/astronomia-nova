import { MachineContext } from '@/state/xstate/MachineProviders';
import { useKeyDown, useKeyPressed } from '@react-hooks-library/core';
import { useFrame, useThree } from '@react-three/fiber';
import { useController, useXR, useXREvent, XR } from '@react-three/xr';
import { useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { Event, EventListener, Vector3, XRTargetRaySpace } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { FAR_CLIP, NEAR_CLIP } from '../scene-constants';

export const PlayerControls = () => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const { player, controllers, isPresenting } = useXR();
  const leftController = useController('left');
  const rightController = useController('right');

  const session = useSelector(vrActor, ({ context }) => context.session);
  useXREvent('connected', (event) => console.log('connected!', event));
  useXREvent('disconnected', (event) => console.log('disconnected!', event));

  const gl = useThree(({ gl }) => gl);
  const xr = useThree(({ gl }) => gl.xr);

  useEffect(() => {
    console.log('xr enabled?', xr.enabled);

    if (!player || !isPresenting || !controllers[0] || !controllers[1]) return;
    console.log('controller count:', controllers.length);
    console.log('initializing player controls!');
    // Assign player.
    vrActor.send({ type: 'ASSIGN_PLAYER', player });

    // Assign controllers.
    for (const controller of controllers) {
      if (controller.inputSource.handedness === 'left') {
        vrActor.send({
          type: 'ASSIGN_LEFT_CONTROLLER',
          controller,
        });
      } else if (controller.inputSource.handedness === 'right') {
        vrActor.send({
          type: 'ASSIGN_RIGHT_CONTROLLER',
          controller,
        });
      }
    }
  }, [isPresenting, player, controllers, vrActor, xr.enabled]);

  useFrame((state, delta, frame) => {
    // const leftController = controllers[1];
    // const rightController = controllers[0];
    if (!session || !player || !rightController || !leftController) return;
    const leftGamepad = leftController.inputSource.gamepad;
    if (!leftGamepad) return;

    const leftAxes = leftGamepad.axes;
    const x = leftAxes[2];
    const z = leftAxes[3];

    const rightGamepad = rightController.inputSource.gamepad;
    if (!rightGamepad) return;
    const rightAxes = rightGamepad.axes;
    const a = rightAxes[2];
    const b = rightAxes[3];

    if (x === undefined || z === undefined) return;
    if (a === undefined || b === undefined) return;

    // Rotate player.
    // player.rotateOnWorldAxis(_yAxis, -deltaA * rotateSpeed);
    // player.rotateOnAxis(_xAxis, -deltaB * rotateSpeed);
    vrActor.send({ type: 'UPDATE', deltaTime: delta });
    cameraActor.send({ type: 'ROTATE_AZIMUTHAL', deltaAngle: a * 2 });
    cameraActor.send({ type: 'ROTATE_POLAR', deltaAngle: b * 2 });
    cameraActor.send({ type: 'ZOOM', deltaZoom: z / 4 });
    a !== 0 && console.log('azimuthal:', a);
    b !== 0 && console.log('polar:', b);
    z !== 0 && console.log('zoom:', z);
  });

  return (
    <>
      <></>
    </>
  );
};
