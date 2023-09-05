import { TWO_PI } from '../../../simulation/utils/constants';
import { loadEphemeris, loadPhysicalData } from '../loadEphemerides';
import {
  type ComputedEphemerides,
  type ComputedEphemerisTable,
  type ComputedPhysicalData,
  type ComputedPhysicalDataTable,
} from '../types/ComputedEphemerides';
import { ElementTableSchema } from '../types/ElementTable';
import { getSemiLatusRectumFromEccentricity } from '../../../simulation/math/orbital-elements/axes/SemiLatusRectum';
import { getSemiMinorAxisFromSemiLatusRectum } from '../../../simulation/math/orbital-elements/axes/SemiMinorAxis';
import { getLinearEccentricityFromAxes } from '../../../simulation/math/orbital-elements/LinearEccentricity';
import { Vector3 } from 'three';
import { getPosition } from '../../../simulation/math/orbital-elements/Position';
import { getRadiusAtTrueAnomaly } from '../../../simulation/math/orbital-elements/OrbitalRadius';
import {
  getOrbitalSpeedFromRadius,
  getVelocityDirectionFromOrbitalElements,
} from '../../../simulation/math/orbital-elements/Velocity';

const _pos = new Vector3();
const _vel = new Vector3();

export async function computeEphemerides(name: string) {
  const computedPhysicalData = await computePhysicalData(name);
  const physicalDataTable = computedPhysicalData.table;

  // Load ephemeris data.
  const elements = await loadEphemeris(name, 'ELEMENTS');

  if (elements.ephemerisType !== 'ELEMENTS') {
    throw new Error('Invalid ephemeris type');
  }
  const parsedElementTable = await ElementTableSchema.safeParseAsync(
    elements.table
  );
  if (!parsedElementTable.success) {
    throw new Error(parsedElementTable.error.toString());
  }
  const { semiMajorAxis, eccentricity, trueAnomaly } = parsedElementTable.data;

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

  _pos.set(...getPosition(trueAnomaly, semiMajorAxis, eccentricity));
  const radius = getRadiusAtTrueAnomaly(
    trueAnomaly,
    semiMajorAxis,
    eccentricity
  );

  // The Horizons ephemeris data for Jupiter seems to result in it wobbling a bit on its orbit. Using the Vis-Viva equation to re-calculate the velocity seems to fix it though. It also appears to have fixed some wobble with the moon.

  // Load the physical data for the central body.
  const centralBodyPhysicalData = await loadPhysicalData(elements.centerName);
  const centralMass = centralBodyPhysicalData.table.mass;

  // Compute the initial orbital speed.
  const orbitalSpeed = getOrbitalSpeedFromRadius(
    radius,
    centralMass,
    semiMajorAxis
  );

  // Compute the direction of the velocity vector.
  _vel.copy(getVelocityDirectionFromOrbitalElements(trueAnomaly, eccentricity));
  _vel.normalize();
  _vel.multiplyScalar(orbitalSpeed);

  const ephemerisTable: ComputedEphemerisTable = {
    ...parsedElementTable.data,
    semiMinorAxis,
    semiLatusRectum,
    linearEccentricity,
    initialPosition: [_pos.x, 0, -_pos.y],
    initialVelocity: [_vel.x, 0, -_vel.y],
  } as ComputedEphemerisTable;

  const { id, centerId, centerName, epoch } = elements;
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

export async function computePhysicalData(
  name: string
): Promise<ComputedPhysicalData> {
  const physicalData = await loadPhysicalData(name);
  const { id, table } = physicalData;
  const siderealRotRate = Math.abs(table.siderealRotRate);

  const siderealRotationPeriod = TWO_PI / siderealRotRate; // Seconds to make one full rotation about the body's polar axis.

  const computedTable: ComputedPhysicalDataTable = {
    ...table,
    siderealRotRate,
    siderealRotationPeriod,
  };
  const computed: ComputedPhysicalData = {
    id,
    name,
    table: computedTable,
  };
  return computed;
}
