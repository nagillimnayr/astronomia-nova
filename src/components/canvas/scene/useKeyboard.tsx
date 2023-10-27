import { PI, TWO_PI } from '@/constants';
import { normalizeAngle } from '@/helpers/rotation-utils';
import { getLocalUpInWorldCoords } from '@/helpers/vector-utils';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEventListener } from '@react-hooks-library/core';
import { Spherical, Vector3 } from 'three';
import { degToRad, radToDeg } from 'three/src/math/MathUtils';
import { gsap } from 'gsap';
import { KeplerBody } from '../body';

export function useKeyboard() {
  const rootActor = MachineContext.useActorRef();
  const { timeActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  useEventListener('keydown', (event) => {
    // console.log(event.code);

    const env = process.env.NODE_ENV;

    switch (event.code) {
      case 'KeyX': {
        if (env !== 'development') return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;

        controls.lock();
        gsap.to(controls.rotation, {
          x: 0,
          duration: 1,
          onComplete: () => {
            controls.unlock();
          },
        });
        break;
      }
      case 'KeyZ': {
        if (env !== 'development') return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;

        controls.lock();
        gsap.to(controls.rotation, {
          z: 0,
          duration: 1,
          onComplete: () => {
            controls.unlock();
          },
        });
        break;
      }
      case 'KeyY': {
        if (env !== 'development') return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;
        if (controls.isAnimating) return;
        void (async () => {
          await controls.animateRotation(0);
          controls.resetRotation();
        })();

        break;
      }
      case 'KeyU': {
        if (env !== 'development') return;
        const { controls, observer, focusTarget } =
          cameraActor.getSnapshot()!.context;
        if (!controls || !focusTarget || !(focusTarget instanceof KeplerBody))
          return;

        if (controls.isAnimating) return;

        void (async () => {
          await controls.animateRotation(0);
          controls.resetRotation();
          const _focusUp = new Vector3();
          const _controllerUp = new Vector3();

          _focusUp.set(
            ...getLocalUpInWorldCoords(focusTarget.meshRef.current!)
          );
          const bodyMesh = focusTarget.meshRef.current;
          if (!bodyMesh) return;
          const meshParent = bodyMesh.parent;
          if (!meshParent) return;

          controls.resetRotation();
          _controllerUp.set(...getLocalUpInWorldCoords(controls));
          _focusUp.set(...getLocalUpInWorldCoords(meshParent));

          const angle = controls.rotation.x - _controllerUp.angleTo(_focusUp);

          void controls.animateRotation(angle);
        })();

        break;
      }
      case 'KeyP': {
        if (env !== 'development') return;
        const { controls, observer } = cameraActor.getSnapshot()!.context;
        const spherical = new Spherical();
        const observerPos = new Vector3();
        // const cameraPos = new Vector3();
        if (!controls || !observer) return;
        observer.getWorldPosition(observerPos);
        controls.worldToLocal(observerPos);
        spherical.setFromVector3(observerPos);
        spherical.makeSafe();
        controls.normalizeAzimuthalAngle();
        const phi = spherical.phi;
        const theta = normalizeAngle(spherical.theta);
        const diffTheta = theta - controls.azimuthalAngle;

        void controls.animateTo({
          phi,
          theta: Math.abs(diffTheta) < PI ? theta : theta - TWO_PI,
        });

        break;
      }
      case 'Space': {
        if (env !== 'development') return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls) return;

        const azimuth = radToDeg(controls.azimuthalAngle);
        console.log(`azimuthal angle: ${azimuth}`);
        console.log(`controls rotation: `, controls.rotation.toArray());

        console.log(`camera rotation: `, controls.camera.rotation.toArray());

        break;
      }
      /** Sidereal Day advancement. */
      case 'ArrowUp': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: false });
        break;
      }
      case 'Numpad8': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: false });
        break;
      }
      case 'ArrowDown': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        break;
      }
      case 'Numpad2': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        break;
      }
      /** Increment/decrement timescale. */
      case 'ArrowLeft': {
        event.shiftKey
          ? timeActor.send({ type: 'DECREMENT_TIMESCALE_UNIT' })
          : timeActor.send({ type: 'DECREMENT_TIMESCALE' });
        break;
      }
      case 'Numpad4': {
        timeActor.send({ type: 'DECREMENT_TIMESCALE' });
        break;
      }
      case 'ArrowRight': {
        event.shiftKey
          ? timeActor.send({ type: 'INCREMENT_TIMESCALE_UNIT' })
          : timeActor.send({ type: 'INCREMENT_TIMESCALE' });
        break;
      }
      case 'Numpad6': {
        timeActor.send({ type: 'INCREMENT_TIMESCALE' });
        break;
      }
    }
  });
}
