import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import {
  getGamepads,
  getXRButtons,
  getXRThumbstickAxes,
} from '@/lib/xr/pollXRInputSources';
import { useFrame } from '@react-three/fiber';

// Scaling factors for controlling strength of VR controller inputs.
// const ZOOM_FACTOR = 1/4;
const ZOOM_FACTOR = 1 / 8;
const POLAR_FACTOR = 2;
const AZIMUTH_FACTOR = 2;

export const VRThumbstickControls = () => {
  const rootActor = MachineContext.useActorRef();
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  useFrame((state, delta, frame) => {
    if (!(frame instanceof XRFrame)) return;

    // Get gamepads.
    const { leftGamepad, rightGamepad } = getGamepads(frame.session);

    // Check if in surface view mode.
    const onSurface = cameraActor.getSnapshot()!.matches('surface');

    // Poll left thumbstick.
    if (!onSurface && leftGamepad) {
      // Disable zoom if on surface.
      const [leftAxisX, leftAxisY] = getXRThumbstickAxes(leftGamepad);

      if (leftAxisY) {
        // Radial zoom.
        const zoom = leftAxisY * ZOOM_FACTOR;
        cameraActor.send({ type: 'ZOOM', deltaZoom: zoom });
      }
    }
    // Poll right thumbstick.
    if (rightGamepad) {
      const [rightAxisX, rightAxisY] = getXRThumbstickAxes(rightGamepad);

      if (rightAxisX) {
        // Azimuthal rotation.
        let azimuthal = rightAxisX * AZIMUTH_FACTOR;
        // Reverse direction of rotation if on surface.
        onSurface && (azimuthal *= -1);
        cameraActor.send({ type: 'ROTATE_AZIMUTHAL', deltaAngle: azimuthal });
      }

      // If on surface, disable polar rotation.
      if (!onSurface && rightAxisY) {
        // Polar rotation.
        const polar = rightAxisY * POLAR_FACTOR;
        cameraActor.send({ type: 'ROTATE_POLAR', deltaAngle: polar });
      }
    }
  });

  return (
    <>
      <></>
    </>
  );
};
