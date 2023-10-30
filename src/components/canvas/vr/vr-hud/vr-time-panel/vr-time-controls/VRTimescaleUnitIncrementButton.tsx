import { MachineContext } from '@/state/xstate/MachineProviders';
import { useCallback } from 'react';
import { type Vector3Tuple } from 'three';
import { VRIconButton } from '../../vr-ui-components/VRIconButton';

interface VRTimescaleUnitIncrementButtonProps {
  position?: Vector3Tuple;
  reverse?: boolean;
}

export const VRTimescaleUnitIncrementButton = ({
  position,
  reverse,
}: VRTimescaleUnitIncrementButtonProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const handleClick = useCallback(() => {
    const type = reverse
      ? 'DECREMENT_TIMESCALE_UNIT'
      : 'INCREMENT_TIMESCALE_UNIT';
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
