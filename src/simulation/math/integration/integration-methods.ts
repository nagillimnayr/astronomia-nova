import type KeplerBody from '@/simulation/classes/KeplerBody';
import calculateGravitation from '../motion/gravitation';
import { Vector3 } from 'three';

// The central body will always be at the zero vector of the local coordinate space of the orbiting body, so we can simply use a zero vector.
const _centralPos = new Vector3();

const _origin = new Vector3(); // Position of central body.
const _pos = new Vector3(); // Previous position.
const _posMid = new Vector3();
const _vel0 = new Vector3(); // Previous velocity.
const _vel1 = new Vector3(); // New velocity.
const _velAvg = new Vector3(); // Average of previous and new velocities.
const _velMid = new Vector3();
const _acc = new Vector3(); // New Acceleration.

// Euler Method
export function eulerMethod(
  body: KeplerBody,
  centralMass: number,
  deltaTime: number
) {
  _pos.copy(body.position);
  _vel0.copy(body.velocity);
  _vel1.copy(body.velocity);
  _acc.copy(body.acceleration);

  _acc.set(...calculateGravitation(_pos, _origin, centralMass));

  // Update velocity and position
  _vel1.addScaledVector(_acc, deltaTime);
  _pos.addScaledVector(_vel0, deltaTime);

  body.acceleration.copy(_acc);
  body.position.copy(_pos);
  body.velocity.copy(_vel1);
}

// End-point Method
export function endpointMethod(
  body: KeplerBody,
  centralMass: number,
  deltaTime: number
) {
  _pos.copy(body.position);
  _vel0.copy(body.velocity);
  _vel1.copy(body.velocity);
  _acc.copy(body.acceleration);

  _acc.set(...calculateGravitation(_pos, _origin, centralMass));

  // Update velocity and position
  _vel1.addScaledVector(_acc, deltaTime);
  _pos.addScaledVector(_vel1, deltaTime);

  body.acceleration.copy(_acc);
  body.position.copy(_pos);
  body.velocity.copy(_vel1);
}

// Mid-point Method
export function midpointMethod(
  body: KeplerBody,
  centralMass: number,
  deltaTime: number
) {
  _pos.copy(body.position);
  _vel0.copy(body.velocity);
  _vel1.copy(body.velocity);
  _acc.copy(body.acceleration);

  _acc.set(...calculateGravitation(_pos, _origin, centralMass));

  // Update velocity and position
  _vel1.addScaledVector(_acc, deltaTime); // New velocity
  _velAvg.addVectors(_vel0, _vel1).multiplyScalar(0.5); // (v0 + v2) / 2
  _pos.addScaledVector(_velAvg, deltaTime);

  body.acceleration.copy(_acc);
  body.position.copy(_pos);
  body.velocity.copy(_vel1);
}

// Euler-Richardson Method
export function eulerRichardsonMethod(
  body: KeplerBody,
  centralMass: number,
  deltaTime: number
) {
  _pos.copy(body.position);
  _posMid.copy(body.position);
  _vel0.copy(body.velocity);
  _vel1.copy(body.velocity);
  _velMid.copy(body.velocity);
  _acc.copy(body.acceleration);

  _acc.set(...calculateGravitation(_pos, _origin, centralMass));

  // Calculate midpoint.
  _velMid.addScaledVector(_acc, deltaTime / 2);
  _posMid.addScaledVector(_vel0, deltaTime / 2);

  // Calculate acceleration at the midpoint.
  _acc.set(...calculateGravitation(_posMid, _origin, centralMass));

  _vel1.addScaledVector(_acc, deltaTime);
  _pos.addScaledVector(_velMid, deltaTime);

  body.acceleration.copy(_acc);
  body.position.copy(_pos);
  body.velocity.copy(_vel1);
}
