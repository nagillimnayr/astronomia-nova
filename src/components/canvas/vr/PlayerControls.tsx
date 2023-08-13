import { MachineContext } from '@/state/xstate/MachineProviders';
import { useKeyDown, useKeyPressed } from '@react-hooks-library/core';
import { useFrame, useThree } from '@react-three/fiber';
import { useController, useXR, useXREvent, XR } from '@react-three/xr';
import { useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { Event, EventListener, Vector3, XRTargetRaySpace } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { FAR_CLIP, NEAR_CLIP } from '../scene-constants';

const _xAxis: Readonly<Vector3> = new Vector3(1, 0, 0);
const _yAxis: Readonly<Vector3> = new Vector3(0, 1, 0);
const moveSpeed = 1;
const rotateSpeed = 1;

export const PlayerControls = () => {
  const { vrActor } = MachineContext.useSelector(({ context }) => context);
  const { player, controllers, isPresenting } = useXR();
  const leftController = useController('left');
  const rightController = useController('right');

  const session = useSelector(vrActor, ({ context }) => context.session);
  useXREvent('connected', (event) => console.log('connected!', event));
  useXREvent('disconnected', (event) => console.log('disconnected!', event));

  const gl = useThree(({ gl }) => gl);
  const xr = useThree(({ gl }) => gl.xr);

  // useEffect(() => {
  //   console.log('xr enabled?', xr.enabled);
  //   // const leftController = xr.getController(0);
  //   // const rightController = xr.getController(1);
  //   console.log('left controller:', leftController);
  //   console.log('right controller:', rightController);

  //   type ConnectEventListener = EventListener<
  //     Event,
  //     'connected',
  //     XRTargetRaySpace
  //   >;
  //   const leftConnectHandler: ConnectEventListener = (event) => {
  //     console.log('left connected:', event);
  //     if ('data' in event) {
  //       console.log('data:', event.data);
  //       console.log('typeof data:', event.data);
  //     }
  //   };
  //   const rightConnectHandler: ConnectEventListener = (event) => {
  //     console.log('right connected:', event);
  //     if ('data' in event) {
  //       console.log('data:', event.data);
  //       console.log('typeof data:', event.data);
  //     }
  //   };
  //   leftController.addEventListener('connected', leftConnectHandler);
  //   rightController.addEventListener('connected', rightConnectHandler);

  //   const cleanup = () => {
  //     leftController.removeEventListener('connected', leftConnectHandler);
  //     rightController.removeEventListener('connected', rightConnectHandler);
  //   };
  // }, [xr]);

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
    // const leftGamepad = leftController.inputSource.gamepad;
    // if (!leftGamepad) return;

    // const leftAxes = leftGamepad.axes;
    // const x = leftAxes[2];
    // const z = leftAxes[3];

    // const rightGamepad = rightController.inputSource.gamepad;
    // if (!rightGamepad) return;
    // const rightAxes = rightGamepad.axes;
    // const a = rightAxes[2];
    // const b = rightAxes[3];

    // if (x === undefined || z === undefined) return;
    // if (a === undefined || b === undefined) return;
    // const deltaX = x * delta;
    // const deltaZ = z * delta;
    // const deltaA = a * delta;
    // const deltaB = b * delta;

    // // console.log('x:', x);
    // // console.log('z:', z);
    // // console.log('a:', a);
    // // console.log('b:', b);

    // // Translate player.
    // player.translateX(deltaX * moveSpeed);
    // player.translateZ(deltaZ * moveSpeed);

    // Rotate player.
    // player.rotateOnWorldAxis(_yAxis, -deltaA * rotateSpeed);
    // player.rotateOnAxis(_xAxis, -deltaB * rotateSpeed);
    vrActor.send({ type: 'UPDATE', deltaTime: delta });
  });

  return (
    <>
      <></>
    </>
  );
};
