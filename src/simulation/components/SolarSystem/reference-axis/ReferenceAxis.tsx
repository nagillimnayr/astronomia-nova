import { X_AXIS } from '@/simulation/utils/constants';
import { type ColorRepresentation } from 'three';

type Props = {
  color?: ColorRepresentation;
  angle?: number;
  length: number;
};
export const ReferenceAxis = ({ color, angle, length }: Props) => {
  return (
    <>
      <arrowHelper
        ref={(arrow) => {
          if (!arrow) return;
          arrow.setColor(color ?? 'white');
          arrow.setDirection(X_AXIS);
          arrow.rotateY(angle ?? 0);
          arrow.setLength(length, Math.min(0.1 * length, 10));
        }}
      />
    </>
  );
};
