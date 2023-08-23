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

  const getXR = useXR(({ get }) => get);
  const getThree = useThree(({ get }) => get);
  const xr = useThree(({ gl }) => gl.xr);

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
      // rootActor.send({ type: 'ADVANCE_DAY' });
      console.log('button A');

      const vrHud = cameraActor.getSnapshot()!.context.vrHud;

      // Move vrHud closer.
      if (!vrHud) return;
      vrHud.translateZ(0.1);
    }

    if (buttonB && buttonB.pressed) {
      console.log('button B');
      const vrHud = cameraActor.getSnapshot()!.context.vrHud;

      // Move vrHud back.
      if (!vrHud) return;
      vrHud.translateZ(-0.1);
    }

    if (buttonX && buttonX.pressed) {
      // rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
      console.log('button X');
      vrActor.send({ type: 'ADJUST_REF_SPACE_TO_POSE' });
    }

    if (buttonY && buttonY.pressed) {
      console.log('button Y');
      const xrSession = getXR().session;
      if (!xrSession) {
        console.log('no xr session');
        return;
      }
      vrActor.send({ type: 'RESET_FRUSTUM' });
    }
  }, [cameraActor, getXR, vrActor]);
  useInterval(pollXRButtons, 250); // Poll buttons every 0.25 seconds.

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
        console.log('xr near:', xrSession.renderState.depthNear);
        console.log('xr far:', xrSession.renderState.depthFar);
        void xrSession?.updateRenderState({
          depthNear: NEAR_CLIP,
          depthFar: FAR_CLIP,
        });

        break;
      }
      case 'p': {
        const xrSession = getXR().session;
        if (!xrSession) {
          console.log('no xr session');
          return;
        }
        console.log('xr near:', xrSession.renderState.depthNear);
        console.log('xr far:', xrSession.renderState.depthFar);
        void xrSession?.updateRenderState({
          depthNear: 0.1,
          depthFar: 1000,
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

      case '8': {
        const { gl } = getThree();
        const xr = gl.xr;

        const session = xr.getSession();
        const refSpace = xr.getReferenceSpace();
        console.log('refSpace:', refSpace);
        if (!session) return;

        const transform = new XRRigidTransform({ x: 0, y: -0.1, z: 0 });
        const offsetRefSpace = refSpace?.getOffsetReferenceSpace(transform);
        if (offsetRefSpace) {
          xr.setReferenceSpace(offsetRefSpace);
        }

        break;
      }

      case '2': {
        const { gl } = getThree();
        const xr = gl.xr;

        const session = xr.getSession();
        const refSpace = xr.getReferenceSpace();
        console.log('refSpace:', refSpace);
        if (!session) return;

        const transform = new XRRigidTransform({ x: 0, y: 0.1, z: 0 });
        const offsetRefSpace = refSpace?.getOffsetReferenceSpace(transform);
        if (offsetRefSpace) {
          xr.setReferenceSpace(offsetRefSpace);
        }

        break;
      }

      case '5': {
        console.log('5: adjusting pose');
        vrActor.send({ type: 'ADJUST_REF_SPACE_TO_POSE' });
        break;
      }
      case '-': {
        const vrHud = cameraActor.getSnapshot()!.context.vrHud;
        if (!vrHud) return;
        vrHud.translateZ(-0.05);
        console.log('vrHud:', vrHud.position.toArray());
        break;
      }
      case '+': {
        const vrHud = cameraActor.getSnapshot()!.context.vrHud;
        if (!vrHud) return;
        vrHud.translateZ(0.05);
        console.log('vrHud:', vrHud.position.toArray());
        break;
      }
    }
  });

  useEffect(() => {
    if (!session) return;
    // Send event to vrActor so it can be displayed.
    function handleInputEvent(inputEvent: XRInputSourceEvent) {
      vrActor.send({ type: 'ASSIGN_INPUT_EVENT', inputEvent });
    }

    session.addEventListener('select', handleInputEvent);
    session.addEventListener('squeeze', handleInputEvent);

    function handleEnd() {
      if (!session) return;
      session.removeEventListener('select', handleInputEvent);
      session.removeEventListener('squeeze', handleInputEvent);
    }

    session.addEventListener('end', handleEnd);

    return () => {
      handleEnd();
      if (session) {
        session.removeEventListener('end', handleEnd);
      }
    };
  }, [session, vrActor]);

  const deltaNear = 0.01;
  const deltaFar = 100;
  useXREvent(
    'squeeze',
    (event) => {
      vrActor.send({ type: 'INCREASE_NEAR', value: -deltaNear });
    },
    { handedness: 'left' }
  );

  useXREvent(
    'squeeze',
    (event) => {
      vrActor.send({ type: 'INCREASE_NEAR', value: deltaNear });
    },
    { handedness: 'right' }
  );

  useXREvent(
    'select',
    (event) => {
      vrActor.send({ type: 'INCREASE_FAR', value: -deltaFar });
    },
    { handedness: 'left' }
  );

  useXREvent(
    'select',
    (event) => {
      vrActor.send({ type: 'INCREASE_FAR', value: deltaFar });
    },
    { handedness: 'right' }
  );

  return (
    <>
      <></>
    </>
  );
};
