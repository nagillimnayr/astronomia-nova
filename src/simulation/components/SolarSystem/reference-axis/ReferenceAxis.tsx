import { X_AXIS } from '@/simulation/utils/constants';
import { Vector3, type ColorRepresentation } from 'three';

type Props = {
  color?: ColorRepresentation;
  direction?: Vector3;
  length: number;
};
export const ReferenceAxis = ({ color, direction, length }: Props) => {
  return (
    <>
      <arrowHelper
        ref={(arrow) => {
          if (!arrow) return;
          arrow.setColor(color ?? 'white');
          arrow.setDirection(direction ?? X_AXIS);
          arrow.setLength(length, Math.min(0.1 * length, 10));
        }}
      />
    </>
  );
};
