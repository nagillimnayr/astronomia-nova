import {MachineContext} from '@/state/xstate/MachineProviders';
import {getGamepads, getXRThumbstickAxes,} from '@/helpers/xr/pollXRInputSources';
import {useFrame} from '@react-three/fiber';

// Scaling factors for controlling strength of VR controller inputs.
const ZOOM_SPEED = 4;
const POLAR_SPEED = 2 ** 7;
const AZIMUTH_SPEED = 2 ** 7;

/**
 * @description Uses the 'useFrame' hook form '@react-three/fiber' to poll the VR Controller's thumbsticks for input. It passes that input to the cameraActor state machine to pass to the camera controller.
 *
 * @author Ryan Milligan
 * @date Sep/06/2023
 */
export function useVRThumbstickControls() {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

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
        let zoom = leftAxisY * ZOOM_SPEED * delta;
        zoom *= zoom > 0 ? 2 : 1;
        cameraActor.send({ type: 'ZOOM', deltaZoom: zoom });
      }
    }
    // Poll right thumbstick.
    if (rightGamepad) {
      const [rightAxisX, rightAxisY] = getXRThumbstickAxes(rightGamepad);

      if (rightAxisX) {
        // Azimuthal rotation.
        let azimuthal = rightAxisX * AZIMUTH_SPEED * delta;
        // Reverse direction of rotation if on surface.
        onSurface && (azimuthal *= -1);
        cameraActor.send({ type: 'ROTATE_AZIMUTHAL', deltaAngle: azimuthal });
      }

      // If on surface, disable polar rotation.
      if (!onSurface && rightAxisY) {
        // Polar rotation.
        const polar = rightAxisY * POLAR_SPEED * delta;
        cameraActor.send({ type: 'ROTATE_POLAR', deltaAngle: polar });
      }
    }
  });
}
