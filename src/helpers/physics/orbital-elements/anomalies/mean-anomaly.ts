export const computeMeanAnomalyFromMeanMotion = (
  meanMotion: number,
  timeElapsed: number
) => {
  const meanAnomaly = meanMotion * timeElapsed;
  return meanAnomaly;
};
