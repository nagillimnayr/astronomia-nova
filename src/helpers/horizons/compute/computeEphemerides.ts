import {
  type ComputedEphemerides,
  type ComputedEphemerisTable,
} from '@/helpers/horizons/types/ComputedEphemerides';
import { getSemiLatusRectumFromEccentricity } from '@/helpers/physics/orbital-elements/axes/semi-latus-rectum';
import { getSemiMinorAxisFromSemiLatusRectum } from '@/helpers/physics/orbital-elements/axes/semi-minor-axis';
import { getLinearEccentricityFromAxes } from '@/helpers/physics/orbital-elements/linear-eccentricity';
import { getRadiusAtTrueAnomaly } from '@/helpers/physics/orbital-elements/orbital-radius';
import { getPositionFromRadius } from '@/helpers/physics/orbital-state-vectors/position';
import { Vector3 } from 'three';
import {
  getOrbitalSpeedFromRadius,
  getVelocityDirectionFromOrbitalElements,
} from '@/helpers/physics/orbital-state-vectors/velocity';
import { type Ephemerides } from '../types/Ephemeris';

const _pos = new Vector3();
const _vel = new Vector3();

export function computeEphemerides(
  rawEphemerides: Ephemerides,
  centralMass: number
) {
  const elements = rawEphemerides.elementTable;
  const physicalDataTable = rawEphemerides.physicalDataTable;

  const { semiMajorAxis, eccentricity, trueAnomaly } = elements;

  const semiLatusRectum = getSemiLatusRectumFromEccentricity(
    semiMajorAxis,
    eccentricity
  );
  const semiMinorAxis = getSemiMinorAxisFromSemiLatusRectum(
    semiMajorAxis,
    semiLatusRectum
  );

  const linearEccentricity = getLinearEccentricityFromAxes(
    semiMajorAxis,
    semiMinorAxis
  );

  const radius = getRadiusAtTrueAnomaly(
    trueAnomaly,
    semiMajorAxis,
    eccentricity
  );
  getPositionFromRadius(radius, trueAnomaly, _pos);

  // The Horizons ephemeris data for Jupiter seems to result in it wobbling a
  // bit on its orbit. Re-computing the velocity fixes the issue.

  // Compute the initial orbital speed.
  const orbitalSpeed = getOrbitalSpeedFromRadius(
    radius,
    centralMass,
    semiMajorAxis
  );

  // Compute the direction of the velocity vector.
  getVelocityDirectionFromOrbitalElements(trueAnomaly, eccentricity, _vel);
  _vel.multiplyScalar(orbitalSpeed);

  const ephemerisTable: ComputedEphemerisTable = {
    ...elements,
    semiMinorAxis,
    semiLatusRectum,
    linearEccentricity,
    initialPosition: _pos.toArray(),
    initialVelocity: _vel.toArray(),
  } as ComputedEphemerisTable;

  const { id, name, centerId, centerName, epoch } = rawEphemerides;
  const computedEphemerides: ComputedEphemerides = {
    id,
    name,
    centerId,
    centerName,
    epoch,
    ephemerisTable,
    physicalDataTable,
  };

  return computedEphemerides;
}
