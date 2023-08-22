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

      const vrHud = cameraActor.getSnapshot()!.context.vrHud;

      // Move vrHud closer.
      if (!vrHud) return;
      vrHud.translateZ(0.05);
    }

    if (buttonB && buttonB.pressed) {
      console.log('button B');
      const vrHud = cameraActor.getSnapshot()!.context.vrHud;

      // Move vrHud back.
      if (!vrHud) return;
      vrHud.translateZ(-0.05);
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
          return;
        }

        console.log('xr frame:', xrFrame);

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
        const { gl } = getThree();
        const xr = gl.xr;

        const session = xr.getSession();
        const refSpace = xr.getReferenceSpace();
        // console.log('refSpace:', refSpace);
        if (!session) return;

        session
          .requestReferenceSpace('local')
          .then((newRefSpace) => {
            console.log('new refspace:', newRefSpace);
            xr.setReferenceSpace(newRefSpace);
          })
          .catch((reason) => {
            console.error(reason);
          });

        break;
      }
    }
  });

  return (
    <>
      <></>
    </>
  );
};
