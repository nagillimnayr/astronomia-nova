import { PI, Y_AXIS } from '@/simulation/utils/constants';

type Props = {
  length: number;
};
export const Poles = ({ length }: Props) => {
  return (
    <>
      {/** North Pole. */}
      <arrowHelper
        ref={(arrow) => {
          if (!arrow) return;
          arrow.setColor('red');
          arrow.setDirection(Y_AXIS);
          arrow.setLength(length, 0.1 * length);
        }}
      />
      {/** South Pole. */}
      <arrowHelper
        ref={(arrow) => {
          if (!arrow) return;
          arrow.setColor('blue');
          arrow.setDirection(Y_AXIS);
          arrow.setLength(length, 0.1 * length);
          arrow.rotation.set(PI, 0, 0);
        }}
      />
    </>
  );
};
