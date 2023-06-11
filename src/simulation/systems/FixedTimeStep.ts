import { floor } from 'mathjs';
export default class FixedTimeStep {
  private _timeStep: number;
  private _stepsPerSecond: number;
  private _remainder: number;
  private _updateFn: (timeStep: number) => void; // update function

  constructor(stepsPerSecond: number, updateFn: (timeStep: number) => void) {
    this._stepsPerSecond = stepsPerSecond;
    this._timeStep = 1 / stepsPerSecond;
    this._remainder = 0;
    this._updateFn = updateFn;
  }

  public get timeStep(): number {
    return this._timeStep;
  }
  public get stepsPerSecond(): number {
    return this.stepsPerSecond;
  }

  update(deltaTime: number) {
    // determine how many updates we need to do for this frame
    const numOfStepsFloat = this._stepsPerSecond * deltaTime + this._remainder;
    // this value will likely be a floating point number, so
    // we must truncate it to an integer
    const numOfStepsInt = floor(numOfStepsFloat);

    // Save the truncated part to add it on during the next update
    this._remainder = numOfStepsFloat - numOfStepsInt;

    // Call the update function the requisite number of times
    for (let i = 0; i < numOfStepsInt; i++) {
      this._updateFn(this._timeStep);
    }
  }
}

/**
 * @description Function factory to create update functions which implement
 * a fixed time-step.
 *
 * @author Ryan Milligan
 * @date 01/06/2023
 * @export
 * @param {number} stepsPerSecond
 * @param {(timeStep: number) => void} updateFn
 * @returns {*}
 */
export function makeFixedUpdateFn(
  updateFn: (timeStep: number) => void,
  stepsPerSecond: number
) {
  let remainder: number = 0; // Will be captured in closure
  const timeStep = 1 / stepsPerSecond;

  const update = (deltaTime: number) => {
    // determine how many updates we need to do for this frame
    const numOfStepsFloat = stepsPerSecond * deltaTime + remainder;
    // this value will likely be a floating point number, so
    // we must truncate it to an integer
    const numOfStepsInt = floor(numOfStepsFloat);

    // Save the truncated part to add it on during the next update
    remainder = numOfStepsFloat - numOfStepsInt;

    // Call the update function the requisite number of times
    for (let i = 0; i < numOfStepsInt; i++) {
      updateFn(timeStep);
    }
  };

  return update;
}
