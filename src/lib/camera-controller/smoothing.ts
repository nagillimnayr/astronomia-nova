export function smoothCritDamp(
  from: number,
  to: number,
  velocity: number,
  smoothTime: number,
  deltaTime: number
): [number, number] {
  const omega = 2 / smoothTime;
  const deltaValue = from - to;

  const omegaDt = omega * deltaTime;
  const omegaDtSq = omegaDt * omegaDt;
  const omegaDtCubed = omegaDtSq * omegaDt;
  const exponentialDecay =
    1 / (1 + omegaDt + 0.48 * omegaDtSq + 0.235 * omegaDtCubed);

  const temp = (velocity + omega * deltaValue) * deltaTime;

  const newValue = to + (deltaValue + temp) * exponentialDecay;
  const newVelocity = (velocity - omega * temp) * exponentialDecay;

  return [newValue, newVelocity];
}
