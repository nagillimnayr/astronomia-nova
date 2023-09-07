const EPSILON: Readonly<number> = 1e-12;
/*
 * To find the position of an orbiting body at a given time, the Mean Anomaly must first be calculated from the time. Then, we must solve Kepler's equation ( M = E - sin(E) ) to get the Eccentric Anomaly (E).
 * We can then easily calculate the radius and position from the Eccentric Anomaly.
 * However, solving for E has no closed-form solution, since sine is a transcendental function, it cannot be solved algebraically.
 * The solution to E can be approximated using Numerical Analysis, such as with Newton's Method.
 * At Higher eccentricities, the convergence slows down, and for hyperbolic trajectories, a different equation  must be used.
 */
// ! Try caching the previous value of E to seed Newton's method
const getEccentricAnomalyNewtonsMethod = (
  meanAnomaly: number,
  eccentricity: number
) => {
  // f(E) = E - e * sin(E)  - M(t) = 0
  const tolerance = 1e-6;
  const maxIter = 10;

  let eccentricAnomaly = 0.0;
  if (eccentricity > 0.8) {
    // Set initial guess to E_0 = Pi
    eccentricAnomaly = Math.PI;
  } // Set initial guess to E_0 = M(t)
  else eccentricAnomaly = meanAnomaly;

  // Iteratively apply Newton's Method until an arbitrary level of accuracy is reached
  for (let i = 0; i < maxIter; i++) {
    // E_i+1 = E_i - (E_i - e*sin(E_i) - M)
    const derivative = 1 - eccentricity * Math.cos(eccentricAnomaly);

    // dont divide by zero
    if (Math.abs(derivative) < EPSILON) {
      break;
    }

    const difference =
      (eccentricAnomaly -
        eccentricity * Math.sin(eccentricAnomaly) -
        meanAnomaly) /
      derivative;
    eccentricAnomaly = eccentricAnomaly - difference;

    if (difference < tolerance) break;
  }

  return eccentricAnomaly;
};
