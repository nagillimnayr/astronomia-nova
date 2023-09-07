/**
 * @description Retrieves the left and right XR Gamepads, or undefined if they cannot be found.
 *
 * @author Ryan Milligan
 * @date 24/08/2023
 * @param {XRSession} session
 * @returns {*}  {(Gamepad | undefined)}
 */
export function getGamepads(session: XRSession): {
  leftGamepad: Gamepad | undefined;
  rightGamepad: Gamepad | undefined;
} {
  // Get input sources.
  let leftInputSource: XRInputSource | undefined = undefined;
  let rightInputSource: XRInputSource | undefined = undefined;
  for (const source of session.inputSources) {
    if (!leftInputSource && source.handedness === 'left') {
      leftInputSource = source;
    } else if (!rightInputSource && source.handedness === 'right') {
      rightInputSource = source;
    }
  }

  // Get gamepads.
  const leftGamepad = leftInputSource ? leftInputSource.gamepad : undefined;
  const rightGamepad = rightInputSource ? rightInputSource.gamepad : undefined;

  return { leftGamepad, rightGamepad };
}

/**
 * @description Polls the XR Gamepad for thumbstick input and returns an array containing the X and Y axis values, or undefined if the axes don't exist.
 *
 * @author Ryan Milligan
 * @date 24/08/2023
 * @export
 * @param {Gamepad} gamepad
 * @returns {*}
 */
export function getXRThumbstickAxes(gamepad: Gamepad) {
  /** 'xr-standard' Gamepad Mapping
   * axes[0]: Primary touchpad X
   * axes[1]: Primary touchpad Y
   * axes[2]: Primary thumbstick X
   * axes[3]: Primary thumbstick Y
   *
   * https://immersive-web.github.io/webxr-gamepads-module/#xr-standard-heading
   */

  // Get gamepad.
  const axes = gamepad.axes;
  const axisX = axes[2];
  const axisY = axes[3];

  return [axisX, axisY];
}

/**
 * @description Returns an object mapping the GamepadButtons to identifiers.
 *
 * @author Ryan Milligan
 * @date 24/08/2023
 * @export
 * @param {Gamepad} gamepad
 * @returns {*}
 */
export function getAllXRButtons(gamepad: Gamepad) {
  /** 'xr-standard' Gamepad Mapping
   * buttons[0]: Primary trigger
   * buttons[1]: Primary squeeze button
   * buttons[2]: Primary touchpad
   * buttons[3]: Primary thumbstick
   *
   * Additional buttons should appear in order of decreasing importance.
   * For the Meta Quest 2 (Oculus 2):
   * buttons[4]: 'A' | 'X'
   * buttons[5]: 'B' | 'Y'
   *
   * https://immersive-web.github.io/webxr-gamepads-module/#xr-standard-heading
   */

  // Poll gamepad buttons.
  const buttons = gamepad.buttons;
  const trigger = buttons[0];
  const squeeze = buttons[1];
  const touchpad = buttons[2];
  const thumbstick = buttons[3];
  const primary = buttons[4];
  const secondary = buttons[5];

  return {
    trigger,
    squeeze,
    touchpad,
    thumbstick,
    primary,
    secondary,
  };
}

/**
 * @description Returns an array containing the primary GamepadButtons. Only retrieves the primary buttons (['A', 'B'] | ['X', 'Y']).
 *
 * @author Ryan Milligan
 * @date 24/08/2023
 * @export
 * @param {Gamepad} gamepad
 * @returns {*}
 */
export function getXRButtons(gamepad: Gamepad) {
  /** 'xr-standard' Gamepad Mapping
   * buttons[0]: Primary trigger
   * buttons[1]: Primary squeeze button
   * buttons[2]: Primary touchpad
   * buttons[3]: Primary thumbstick
   *
   * Additional buttons should appear in order of decreasing importance.
   * For the Meta Quest 2 (Oculus 2):
   * buttons[4]: 'A' | 'X'
   * buttons[5]: 'B' | 'Y'
   *
   * https://immersive-web.github.io/webxr-gamepads-module/#xr-standard-heading
   */

  // Poll gamepad buttons.
  const buttons = gamepad.buttons;
  const primary = buttons[4];
  const secondary = buttons[5];

  return [primary, secondary];
}
