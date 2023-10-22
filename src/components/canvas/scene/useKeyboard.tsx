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

    switch (event.code) {
      case 'KeyZ': {
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
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;

        controls.lock();
        gsap.to(controls.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          onComplete: () => {
            controls.unlock();
          },
        });
        gsap.to(controls.camera.rotation, {
          z: 0,
          x: 0,
          y: 0,
          duration: 1,
          onComplete: () => {
            controls.unlock();
          },
        });

        break;
      }
      case 'KeyU': {
        const { controls, observer, focusTarget } =
          cameraActor.getSnapshot()!.context;
        if (!controls || !focusTarget || !(focusTarget instanceof KeplerBody))
          return;

        const _focusUp = new Vector3();
        const _controllerUp = new Vector3();

        _focusUp.set(...getLocalUpInWorldCoords(focusTarget.meshRef.current!));
        const bodyMesh = focusTarget.meshRef.current;
        if (!bodyMesh) return;
        const meshParent = bodyMesh.parent;
        if (!meshParent) return;

        _controllerUp.set(...getLocalUpInWorldCoords(controls));
        _focusUp.set(...getLocalUpInWorldCoords(meshParent));

        const obliquity = degToRad(focusTarget.obliquity);

        const angle = controls.rotation.x - _controllerUp.angleTo(_focusUp);
        controls.lock();

        gsap.to(controls.rotation, {
          // x: -obliquity,
          x: angle,
          // y: 0,
          // z: 0,
          duration: 1,
          onComplete: () => {
            controls.unlock();
          },
        });

        break;
      }
      case 'KeyP': {
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
          duration: 1,
        });

        break;
      }
      case 'Space': {
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls) return;
        const x = radToDeg(controls.rotation.x);
        const y = radToDeg(controls.rotation.y);
        const z = radToDeg(controls.rotation.z);
        const azimuth = radToDeg(controls.azimuthalAngle);
        console.log(`azimuthal angle: ${azimuth}`);
        console.log(`controls angles: `, { x, y, z });

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
