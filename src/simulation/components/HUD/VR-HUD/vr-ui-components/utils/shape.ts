import { PI, PI_OVER_TWO } from '@/simulation/utils/constants';
import { Path, Shape, ShapeGeometry } from 'three';

const _shape = new Shape();
const _hole = new Path();

/**
 * @description Creates a plane geometry with rounded corners.
 *
 * @author Ryan Milligan
 * @date 18/08/2023
 * @export
 * @param {number} width
 * @param {number} height
 * @param {number} radius
 * @param {number} [segments]
 * @returns {*}
 */
export function makeRoundedPlane(
  width: number,
  height: number,
  radius: number,
  segments?: number
) {
  _shape.curves.length = 0;
  _shape.holes.length = 0;
  const x = width / 2;
  const y = height / 2;

  // Clamp the radius to the lesser side length;
  const min = Math.min(x, y);
  if (radius > min) {
    radius = min;
  }

  _shape.moveTo(x - radius, y);
  _shape.lineTo(-x + radius, y);
  _shape.arc(0, -radius, radius, PI_OVER_TWO, PI, false);
  _shape.lineTo(-x, -y + radius);
  _shape.arc(radius, 0, radius, PI, 3 * PI_OVER_TWO, false);
  _shape.lineTo(x - radius, -y);
  _shape.arc(0, radius, radius, 3 * PI_OVER_TWO, 0, false);
  _shape.lineTo(x, y - radius);
  _shape.arc(-radius, 0, radius, 0, PI_OVER_TWO, false);
  _shape.closePath();

  return new ShapeGeometry(_shape, segments);
}

export function makeRoundedPlaneBorder(
  width: number,
  height: number,
  radius: number,
  borderWidth: number,
  segments?: number
) {
  _shape.curves.length = 0;
  _shape.holes.length = 0;
  _hole.curves.length = 0;

  const x2 = width / 2;
  const y2 = height / 2;
  const x = x2 - borderWidth;
  const y = y2 - borderWidth;
  const radius2 = radius + borderWidth;

  // Clamp the radius to the lesser side length;
  const min = Math.min(x, y);
  if (radius > min) {
    radius = min;
  }

  // Center of top-left arc.
  const topLeftCX = -x + radius;
  const topLeftCY = y - radius;

  // Center of bottom-left arc.
  const bottomLeftCX = -x + radius;
  const bottomLeftCY = -y + radius;

  // Center of bottom-right arc.
  const bottomRightCX = x - radius;
  const bottomRightCY = -y + radius;

  // Center of top-right arc.
  const topRightCX = x - radius;
  const topRightCY = y - radius;

  // Outer rounded rect.
  _shape.moveTo(x2 - radius2, y2);
  _shape.lineTo(-x2 + radius2, y2);
  // Top-left arc.
  _shape.absarc(topLeftCX, topLeftCY, radius2, PI_OVER_TWO, PI, false);
  _shape.lineTo(-x2, -y2 + radius2);
  // Bottom-left arc.
  _shape.absarc(
    bottomLeftCX,
    bottomLeftCY,
    radius2,
    PI,
    3 * PI_OVER_TWO,
    false
  );
  _shape.lineTo(x2 - radius2, -y2);
  // Bottom-right arc.
  _shape.absarc(
    bottomRightCX,
    bottomRightCY,
    radius2,
    3 * PI_OVER_TWO,
    0,
    false
  );
  _shape.lineTo(x2, y2 - radius2);
  // Top-right arc.
  _shape.absarc(topRightCX, topRightCY, radius2, 0, PI_OVER_TWO, false);
  _shape.closePath();

  // Inner rounded rect.
  _hole.moveTo(x - radius, y);
  _hole.lineTo(-x + radius, y);
  // Top-left arc.
  _hole.absarc(topLeftCX, topLeftCY, radius, PI_OVER_TWO, PI, false);
  _hole.lineTo(-x, -y + radius);
  // Bottom-left arc.
  _hole.absarc(bottomLeftCX, bottomLeftCY, radius, PI, 3 * PI_OVER_TWO, false);
  _hole.lineTo(x - radius, -y);
  // Bottom-right arc.
  _hole.absarc(bottomRightCX, bottomRightCY, radius, 3 * PI_OVER_TWO, 0, false);
  _hole.lineTo(x, y - radius);
  // Top-right arc.
  _hole.absarc(topRightCX, topRightCY, radius, 0, PI_OVER_TWO, false);
  _hole.closePath();

  _shape.holes.push(_hole);

  return new ShapeGeometry(_shape, segments);
}
