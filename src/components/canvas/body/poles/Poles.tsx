import { PI, Y_AXIS } from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { type Vector3Tuple } from 'three';

export type PoleProps = {
  length: number;
  rotation?: Vector3Tuple;
};
export const Poles = ({ length, rotation }: PoleProps) => {
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
      {isVisible && (
        <group rotation={rotation}>
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
        </group>
      )}
    </>
  );
};
