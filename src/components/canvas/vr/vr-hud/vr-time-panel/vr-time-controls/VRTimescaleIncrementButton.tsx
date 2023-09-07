import { MachineContext } from '@/state/xstate/MachineProviders';
import { useCallback } from 'react';
import { type Vector3Tuple } from 'three';
import { VRIconButton } from '../../vr-ui-components/VRIconButton';

interface VRTimescaleIncrementButtonProps {
  position?: Vector3Tuple;
  reverse?: boolean;
}

export const VRTimescaleIncrementButton = ({
  position,
  reverse,
}: VRTimescaleIncrementButtonProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const handleClick = useCallback(() => {
    const type = reverse ? 'DECREMENT_TIMESCALE' : 'INCREMENT_TIMESCALE';
    timeActor.send({ type });
  }, [reverse, timeActor]);

  const iconSrc = reverse
    ? 'icons/MdiChevronLeft.svg'
    : 'icons/MdiChevronRight.svg';

  return (
    <>
      <object3D position={position}>
        <VRIconButton iconSrc={iconSrc} onClick={handleClick} />
      </object3D>
    </>
  );
};
