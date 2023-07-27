import type KeplerBody from '@/simulation/classes/KeplerBody';
import calculateGravitation from '../motion/gravitation';
import { Vector3 } from 'three';

// The central body will always be at the zero vector of the local coordinate space of the orbiting body, so we can simply use a zero vector.
const _centralPos = new Vector3();

const _origin = new Vector3();
const _pos0 = new Vector3();
const _pos1 = new Vector3();
const _posMid = new Vector3();
const _vel0 = new Vector3();
const _vel1 = new Vector3();
const _velAvg = new Vector3();
const _velMid = new Vector3();
const _acc0 = new Vector3();
const _acc1 = new Vector3();
const _accMid = new Vector3();
const _accAvg = new Vector3();

// Euler Method
export function eulerMethod(
  body: KeplerBody,
  centralMass: number,
  deltaTime: number
) {
  _pos0.copy(body.position);
  _pos1.copy(body.position);
  _vel0.copy(body.velocity);
  _vel1.copy(body.velocity);

  _acc0.set(...calculateGravitation(_pos0, _origin, centralMass));

  // Update velocity and position
  _vel1.addScaledVector(_acc0, deltaTime);
  _pos1.addScaledVector(_vel0, deltaTime);

  body.acceleration.copy(_acc0);
  body.position.copy(_pos1);
  body.velocity.copy(_vel1);
}

// End-point Method
export function endpointMethod(
  body: KeplerBody,
  centralMass: number,
  deltaTime: number
) {
  _pos0.copy(body.position);
  _pos1.copy(body.position);
  _vel0.copy(body.velocity);
  _vel1.copy(body.velocity);

  _acc0.set(...calculateGravitation(_pos0, _origin, centralMass));

  // Update velocity and position
  _vel1.addScaledVector(_acc0, deltaTime);
  _pos1.addScaledVector(_vel1, deltaTime);

  body.acceleration.copy(_acc0);
  body.position.copy(_pos1);
  body.velocity.copy(_vel1);
}

// Mid-point Method
export function midpointMethod(
  body: KeplerBody,
  centralMass: number,
  deltaTime: number
) {
  _pos0.copy(body.position);
  _pos1.copy(body.position);
  _vel0.copy(body.velocity);
  _vel1.copy(body.velocity);

  _acc0.set(...calculateGravitation(_pos0, _origin, centralMass));

  // Update velocity and position
  _vel1.addScaledVector(_acc0, deltaTime); // New velocity
  _velAvg.addVectors(_vel0, _vel1).multiplyScalar(0.5); // (v0 + v2) / 2
  _pos1.addScaledVector(_velAvg, deltaTime);

  body.acceleration.copy(_acc0);
  body.position.copy(_pos1);
  body.velocity.copy(_vel1);
}

// Euler-Richardson Method
export function eulerRichardsonMethod(
  body: KeplerBody,
  centralMass: number,
  deltaTime: number
) {
  _pos0.copy(body.position);
  _pos1.copy(body.position);
  _posMid.copy(body.position);
  _vel0.copy(body.velocity);
  _vel1.copy(body.velocity);
  _velMid.copy(body.velocity);

  _acc0.set(...calculateGravitation(_pos0, _origin, centralMass));

  // Calculate midpoint.
  _velMid.addScaledVector(_acc0, deltaTime / 2);
  _posMid.addScaledVector(_vel0, deltaTime / 2);

  // Calculate acceleration at the midpoint.
  _accMid.set(...calculateGravitation(_posMid, _origin, centralMass));

  _vel1.addScaledVector(_accMid, deltaTime);
  _pos1.addScaledVector(_velMid, deltaTime);

  body.acceleration.copy(_accMid);
  body.position.copy(_pos1);
  body.velocity.copy(_vel1);
}

// Verlet Integration
export function verletIntegration(
  body: KeplerBody,
  centralMass: number,
  deltaTime: number
) {
  _pos0.copy(body.position);
  _pos1.copy(body.position);
  _vel0.copy(body.velocity);
  _vel1.copy(body.velocity);

  _acc0.set(...calculateGravitation(_pos0, _origin, centralMass));

  _pos1
    .addScaledVector(_vel0, deltaTime)
    .addScaledVector(_acc0, 0.5 * deltaTime ** 2);

  _acc1.set(...calculateGravitation(_pos1, _origin, centralMass));
  _accAvg.addVectors(_acc0, _acc1).multiplyScalar(0.5);

  _vel1.addScaledVector(_accAvg, deltaTime);

  body.acceleration.copy(_acc1);
  body.position.copy(_pos1);
  body.velocity.copy(_vel1);
}