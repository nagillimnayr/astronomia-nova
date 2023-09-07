type UpdateFunction = (timeStep: number) => void;

/**
 * @description Function factory to create update functions which implement
 * a fixed time-step.
 *
 * @author Ryan Milligan
 * @date Sep/06/2023
 * @export
 * @param {UpdateFunction<Type>} updateFn - The update function which will be
 *   called for each update step.
 * @param {number} stepsPerSecond - The number of updates to perform each
 *   second.
 * @returns {UpdateFunction<Type>}
 */
export function makeFixedUpdateFn(
  updateFn: UpdateFunction,
  stepsPerSecond: number
): UpdateFunction {
  let remainder = 0; // Will be captured in closure.
  const timeStep = 1 / stepsPerSecond; // constant time step between updates.

  const update = (deltaTime: number) => {
    // Determine how many updates we need to do for this frame.
    const numOfStepsFloat = stepsPerSecond * Math.abs(deltaTime) + remainder;
    // This value will likely be a floating point number, so we must truncate
    // it to an integer.
    const numOfStepsInt = Math.floor(numOfStepsFloat);

    // Save the truncated part to add it on during the next update.
    remainder = numOfStepsFloat - numOfStepsInt;

    if (deltaTime >= 0) {
      // Call the update function the requisite number of times.
      for (let i = 0; i < numOfStepsInt; i++) {
        updateFn(timeStep);
      }
    }
    // If time reversed:
    else {
      // Call the update function the requisite number of times.
      for (let i = 0; i < numOfStepsInt; i++) {
        updateFn(-timeStep);
      }
    }
  };

  return update;
}
