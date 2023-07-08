import type { Vector3Tuple } from 'three';

export type VectorTable = {
  name: string;
  date: string;
  position: Vector3Tuple;
  velocity: Vector3Tuple;
  range: number;
  rangeRate: number;
};
