import { X_AXIS } from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { type ColorRepresentation, type Vector3 } from 'three';

type Props = {
  color?: ColorRepresentation;
  direction?: Vector3;
  length: number;
};
export const ReferenceAxis = ({ color, direction, length }: Props) => {
  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const actor = useSelector(
    visibilityActor,
    (state) => state.context.equinoxes
  );
  const isVisible = useSelector(actor, (state) => state.matches('active'));
  return (
    <>
      <arrowHelper
        visible={isVisible}
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
