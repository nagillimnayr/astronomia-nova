export class TimeManager {
  private _timescale: number;
  private _timeElapsed: number;

  constructor() {
    this._timescale = 1;
    this._timeElapsed = 0;
  }

  get timescale() {
    return this._timescale;
  }
  set timescale(value: number) {
    this._timescale = Math.min(Math.max(value, 0), 100);
  }

  get timeElapsed() {
    return this._timeElapsed;
  }
  set timeElapsed(value: number) {
    this._timeElapsed = value;
  }
}
