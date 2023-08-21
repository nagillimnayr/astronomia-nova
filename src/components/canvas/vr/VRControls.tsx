import { METER } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  useEventListener,
  useInterval,
  useKeyDown,
  useKeyPressed,
} from '@react-hooks-library/core';
import { useFrame, useThree } from '@react-three/fiber';
import { useController, useXR, useXREvent, XR } from '@react-three/xr';
import { useCallback, useEffect } from 'react';
import { FAR_CLIP, NEAR_CLIP } from '../scene-constants';

export const VRControls = () => {
  const rootActor = MachineContext.useActorRef();
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const { player, controllers, isPresenting, session } = useXR();
  // const leftController = useController('left');
  // const rightController = useController('right');

  useXREvent('connected', (event) => console.log('connected!', event));
  useXREvent('disconnected', (event) => console.log('disconnected!', event));

  const getXR = useXR(({ get }) => get);
  const getThree = useThree(({ get }) => get);
  const gl = useThree(({ gl }) => gl);
  const xr = useThree(({ gl }) => gl.xr);

  const handleSelectStart = useCallback((event: XRInputSourceEvent) => {
    console.log('selectstart');
  }, []);
  const pollXRButtons = useCallback(() => {
    // cameraActor.send({ type: 'POLL_XR_BUTTONS' });
    const { controllers, session } = getXR();
    if (!session || !controllers) return;
    const leftController = controllers.find(
      (controllerObj) => controllerObj.inputSource.handedness === 'left'
    );
    const rightController = controllers.find(
      (controllerObj) => controllerObj.inputSource.handedness === 'right'
    );
    if (!leftController || !rightController) return;
    const leftGamepad = leftController.inputSource.gamepad;
    if (!leftGamepad) return;
    const rightGamepad = rightController.inputSource.gamepad;
    if (!rightGamepad) return;
    // Poll for button input.
    const leftButtons = leftGamepad.buttons;
    const rightButtons = rightGamepad.buttons;

    const buttonA = rightButtons.at(4);
    const buttonB = rightButtons.at(5);

    const buttonX = leftButtons.at(4);
    const buttonY = leftButtons.at(5);

    if (buttonA && buttonA.pressed) {
      rootActor.send({ type: 'ADVANCE_DAY' });
      console.log('button A');
    }

    if (buttonB && buttonB.pressed) {
      console.log('button B');
    }

    if (buttonX && buttonX.pressed) {
      rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
      console.log('button X');
    }

    if (buttonY && buttonY.pressed) {
      console.log('button Y');
    }
  }, [getXR, rootActor]);
  useInterval(pollXRButtons, 250); // Poll buttons every 0.25 seconds.

  useEffect(() => {
    if (!session) return;
    session.addEventListener('selectstart', handleSelectStart);

    return () => {
      session.removeEventListener('selectstart', handleSelectStart);
    };
  }, [handleSelectStart, session]);

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

  useEventListener('keypress', (event) => {
    // console.log(event.key);
    switch (event.key) {
      case 'o': {
        const xrSession = getXR().session;
        if (!xrSession) {
          console.log('no xr session');
          return;
        }
        console.log('session:', xrSession);
        console.log('xr near:', xrSession.renderState.depthNear);
        console.log('xr far:', xrSession.renderState.depthFar);
        void xrSession?.updateRenderState({
          depthNear: NEAR_CLIP,
          depthFar: FAR_CLIP,
        });
        break;
      }
      case 'f': {
        const xrSession = getXR().session;
        const camera = getThree().camera;
        if (xrSession) {
          console.log('xr near:', xrSession.renderState.depthNear);
          console.log('xr far:', xrSession.renderState.depthFar);
          console.log('cam near:', camera.near);
          console.log('cam far:', camera.far);
        } else console.log('no xr session');

        break;
      }
      case 'v': {
        const { gl } = getThree();
        const xr = gl.xr;
        if (!xr.isPresenting) {
          console.log('xr not presenting!');
          return;
        }
        const xrFrame = xr.getFrame();

        if (!xrFrame) {
          console.log('no xr frame');
          // return;
        } else {
          console.log('xr frame:', xrFrame);
        }
        const referenceSpace = xr.getReferenceSpace();
        if (!referenceSpace) {
          console.log('no reference space');
          return;
        }
        const viewerPose = xrFrame.getViewerPose(referenceSpace);
        if (!viewerPose) {
          console.log('no viewer pose');
          return;
        }
        console.log('viewer pose position:', viewerPose.transform.position);
        break;
      }
      // case '8': {
      //   const { gl } = getThree();
      //   const xr = gl.xr;
      //   if (!xr.isPresenting) {
      //     console.log('xr not presenting');
      //     return;
      //   }

      //   let refSpace = xr.getReferenceSpace();
      //   if (!refSpace) return;
      //   refSpace = refSpace.getOffsetReferenceSpace(
      //     new XRRigidTransform({ x: 0, y: -0.1, z: 0 })
      //   );
      //   xr.setReferenceSpace(refSpace);
      //   break;
      // }
      // case '2': {
      //   const { gl } = getThree();
      //   const xr = gl.xr;
      //   if (!xr.isPresenting) {
      //     console.log('xr not presenting');
      //     return;
      //   }

      //   let refSpace = xr.getReferenceSpace();
      //   if (!refSpace) return;
      //   refSpace = refSpace.getOffsetReferenceSpace(
      //     new XRRigidTransform({ x: 0, y: 0.1, z: 0 })
      //   );
      //   xr.setReferenceSpace(refSpace);
      //   break;
      // }
      // case '5': {
      //   const { gl } = getThree();
      //   const xr = gl.xr;
      //   if (!xr.isPresenting) {
      //     console.log('xr not presenting');
      //     return;
      //   }

      //   vrActor.send({ type: 'RESET_REF_SPACE' });
      //   break;
      // }
      // case '4': {
      //   const { gl } = getThree();
      //   const xr = gl.xr;
      //   if (!xr.isPresenting) {
      //     console.log('xr not presenting');
      //     return;
      //   }

      //   let refSpace = xr.getReferenceSpace();
      //   if (!refSpace) return;
      //   refSpace = refSpace.getOffsetReferenceSpace(
      //     new XRRigidTransform({ x: 0.1, y: 0, z: 0 })
      //   );
      //   xr.setReferenceSpace(refSpace);
      //   break;
      // }
      // case '6': {
      //   const { gl } = getThree();
      //   const xr = gl.xr;
      //   if (!xr.isPresenting) {
      //     console.log('xr not presenting');
      //     return;
      //   }

      //   let refSpace = xr.getReferenceSpace();
      //   if (!refSpace) return;
      //   refSpace = refSpace.getOffsetReferenceSpace(
      //     new XRRigidTransform({ x: -0.1, y: 0, z: 0 })
      //   );
      //   xr.setReferenceSpace(refSpace);
      //   break;
      // }
      // case '-': {
      //   const { gl } = getThree();
      //   const xr = gl.xr;
      //   if (!xr.isPresenting) {
      //     console.log('xr not presenting');
      //     return;
      //   }

      //   let refSpace = xr.getReferenceSpace();
      //   if (!refSpace) return;
      //   refSpace = refSpace.getOffsetReferenceSpace(
      //     new XRRigidTransform({ x: 0, y: 0, z: 0.1 })
      //   );
      //   xr.setReferenceSpace(refSpace);
      //   break;
      // }
      // case '+': {
      //   const { gl } = getThree();
      //   const xr = gl.xr;
      //   if (!xr.isPresenting) {
      //     console.log('xr not presenting');
      //     return;
      //   }

      //   let refSpace = xr.getReferenceSpace();
      //   if (!refSpace) return;
      //   refSpace = refSpace.getOffsetReferenceSpace(
      //     new XRRigidTransform({ x: 0, y: 0, z: -0.1 })
      //   );
      //   xr.setReferenceSpace(refSpace);
      //   break;
      // }
      // case ' ': {
      //   const controls = cameraActor.getSnapshot()!.context.controls;
      //   if (!controls) return;
      //   console.log('cam', controls.camera);
      // }
    }
  });

  // useFrame((state, delta, frame) => {
  //   // const leftController = controllers[1];
  //   // const rightController = controllers[0];
  //   if (!session || !player || !rightController || !leftController) return;
  //   const leftGamepad = leftController.inputSource.gamepad;
  //   if (!leftGamepad) return;

  //   const leftAxes = leftGamepad.axes;
  //   const x = leftAxes[2];
  //   const z = leftAxes[3];

  //   const rightGamepad = rightController.inputSource.gamepad;
  //   if (!rightGamepad) return;
  //   const rightAxes = rightGamepad.axes;
  //   const a = rightAxes[2];
  //   const b = rightAxes[3];

  //   if (x === undefined || z === undefined) return;
  //   if (a === undefined || b === undefined) return;

  //   // Rotate player.
  //   // player.rotateOnWorldAxis(_yAxis, -deltaA * rotateSpeed);
  //   // player.rotateOnAxis(_xAxis, -deltaB * rotateSpeed);
  //   // vrActor.send({ type: 'UPDATE', deltaTime: delta });
  //   cameraActor.send({ type: 'ROTATE_AZIMUTHAL', deltaAngle: a * 2 });
  //   cameraActor.send({ type: 'ROTATE_POLAR', deltaAngle: b * 2 });
  //   cameraActor.send({ type: 'ZOOM', deltaZoom: z / 4 });
  //   a !== 0 && console.log('azimuthal:', a);
  //   b !== 0 && console.log('polar:', b);
  //   z !== 0 && console.log('zoom:', z);
  // });

  return (
    <>
      <></>
    </>
  );
};
