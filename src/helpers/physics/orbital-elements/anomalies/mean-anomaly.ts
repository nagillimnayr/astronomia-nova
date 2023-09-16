/** @module Mean-Anomaly */

export const computeMeanAnomalyFromMeanMotion = (
  initialMeanAnomaly: number,
  meanMotion: number,
  timeElapsed: number
) => {
  return initialMeanAnomaly + meanMotion * timeElapsed;
};
