import { PI, PI_OVER_TWO } from '@/simulation/utils/constants';
import { Path, Shape, ShapeGeometry } from 'three';

// const _shape = new Shape();
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
  shape: Shape
) {
  shape.curves.length = 0;
  shape.holes.length = 0;
  _hole.curves.length = 0;

  const x = width / 2;
  const y = height / 2;

  // Clamp the radius to the lesser side length;
  const minOver2 = Math.min(x, y) / 2;
  if (radius > minOver2) {
    radius = minOver2;
  }

  shape.moveTo(x - radius, y);
  shape.lineTo(-x + radius, y);
  shape.arc(0, -radius, radius, PI_OVER_TWO, PI, false);
  shape.lineTo(-x, -y + radius);
  shape.arc(radius, 0, radius, PI, 3 * PI_OVER_TWO, false);
  shape.lineTo(x - radius, -y);
  shape.arc(0, radius, radius, 3 * PI_OVER_TWO, 0, false);
  shape.lineTo(x, y - radius);
  shape.arc(-radius, 0, radius, 0, PI_OVER_TWO, false);
  shape.closePath();

  return shape;
}

export function makeRoundedPlaneBorder(
  width: number,
  height: number,
  radius: number,
  borderWidth: number,
  shape: Shape
) {
  shape.curves.length = 0;
  shape.holes.length = 0;
  _hole.curves.length = 0;

  const x2 = width / 2;
  const y2 = height / 2;
  const x = x2 - borderWidth;
  const y = y2 - borderWidth;
  const radius2 = radius + borderWidth;

  // Clamp the radius to the lesser side length;
  const minOver2 = Math.min(x, y) / 2;
  if (radius > minOver2) {
    radius = minOver2;
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
  shape.moveTo(x2 - radius2, y2);
  shape.lineTo(-x2 + radius2, y2);
  // Top-left arc.
  shape.absarc(topLeftCX, topLeftCY, radius2, PI_OVER_TWO, PI, false);
  shape.lineTo(-x2, -y2 + radius2);
  // Bottom-left arc.
  shape.absarc(bottomLeftCX, bottomLeftCY, radius2, PI, 3 * PI_OVER_TWO, false);
  shape.lineTo(x2 - radius2, -y2);
  // Bottom-right arc.
  shape.absarc(
    bottomRightCX,
    bottomRightCY,
    radius2,
    3 * PI_OVER_TWO,
    0,
    false
  );
  shape.lineTo(x2, y2 - radius2);
  // Top-right arc.
  shape.absarc(topRightCX, topRightCY, radius2, 0, PI_OVER_TWO, false);
  shape.closePath();

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

  shape.holes.push(_hole);

  return shape;
}
