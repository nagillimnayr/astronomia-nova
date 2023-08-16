import { PI, Y_AXIS } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

type Props = {
  length: number;
};
export const Poles = ({ length }: Props) => {
  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const actor = useSelector(
    visibilityActor,
    (state) => state.context.polarAxes
  );
  const isVisible = useSelector(actor, (state) => state.matches('active'));
  return (
    <>
      {/** North Pole. */}
      <arrowHelper
        visible={isVisible}
        ref={(arrow) => {
          if (!arrow) return;
          arrow.setColor('red');
          arrow.setDirection(Y_AXIS);
          arrow.setLength(length, 0.1 * length);
        }}
      />
      {/** South Pole. */}
      <arrowHelper
        visible={isVisible}
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
