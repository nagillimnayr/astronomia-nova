import { DEV_ENV, J2000, PI, TWO_PI } from '@/constants';
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
      case 'KeyJ': {
        if (!DEV_ENV) return;
        timeActor.send({ type: 'SET_DATE', date: J2000 });
        break;
      }
      case 'KeyX': {
        if (!DEV_ENV) return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;

        const { x, y, z } = controls.rotation;

        void controls.animateRotation([0, y, z]);
        break;
      }
      case 'KeyC': {
        if (!DEV_ENV) return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;

        const { x, y, z } = controls.rotation;

        void controls.animateRotation([x, 0, z]);
        break;
      }
      case 'KeyZ': {
        if (!DEV_ENV) return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;

        const { x, y, z } = controls.rotation;

        void controls.animateRotation([x, y, 0]);
        break;
      }
      case 'O': {
        if (!DEV_ENV) return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;
        if (controls.isAnimating) return;

        controls.resetRotation();

        break;
      }
      case 'KeyR': {
        if (!DEV_ENV) return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;
        if (controls.isAnimating) return;

        void controls.animateResetRotation();

        break;
      }
      case 'KeyY': {
        if (!DEV_ENV) return;
        const { controls } = cameraActor.getSnapshot()!.context;
        if (!controls || !controls.camera) return;
        if (controls.isAnimating) return;

        void (async () => {
          await controls.animateRoll(0);
          // controls.resetTarget();
        })();
        break;
      }
      case 'KeyU': {
        if (!DEV_ENV) return;
        const { controls, focusTarget } = cameraActor.getSnapshot()!.context;
        if (!controls || !focusTarget || !(focusTarget instanceof KeplerBody))
          return;

        if (controls.isAnimating) return;

        void (async () => {
          const roll = degToRad(focusTarget.obliquity);

          await controls.animateRoll(roll);
          // await gsap.to(controls.rotation, {
          //   x: -obliquity,
          //   y: 0,
          //   z: 0,
          //   duration: 1,
          // });
        })();

        break;
      }
      case 'KeyP': {
        if (!DEV_ENV) return;
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

        void controls.animateToSpring({
          phi,
          theta: Math.abs(diffTheta) < PI ? theta : theta - TWO_PI,
        });

        break;
      }
      case 'Space': {
        if (!DEV_ENV) return;
        const { controls, focusTarget } = cameraActor.getSnapshot()!.context;
        if (!controls) return;
        event.preventDefault();

        const azimuth = radToDeg(controls.azimuthalAngle);
        console.log(`azimuthal angle: ${azimuth}`);
        console.log(`controls rotation: `, controls.rotation.toArray());

        // console.log(`camera rotation: `, controls.camera.rotation.toArray());
        // console.log(`camera roll: `, controls.roll);
        if (!focusTarget || !(focusTarget instanceof KeplerBody)) return;
        console.log('focus target rotation:', focusTarget.rotation.toArray());
        const mesh = focusTarget.meshRef.current;
        if (!mesh) return;
        console.log('mesh rotation:', mesh.rotation.toArray());
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
