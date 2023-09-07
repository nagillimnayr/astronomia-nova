import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { useCallback } from 'react';
import { type Vector3Tuple } from 'three';
import { VRIconButton } from '../../vr-ui-components/VRIconButton';

type VRAdvanceTimeButtonProps = {
  position?: Vector3Tuple;
  reverse?: boolean;
};
export const VRAdvanceTimeButton = ({
  position = [0, 0, 0],
  reverse,
}: VRAdvanceTimeButtonProps) => {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  // Get focusTarget.
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  const handleClick = useCallback(() => {
    rootActor.send({ type: 'ADVANCE_DAY', reverse });
  }, [reverse, rootActor]);

  const iconSrc = reverse
    ? 'icons/MdiWeatherSunsetDown.svg'
    : 'icons/MdiWeatherSunsetUp.svg';

  return (
    <>
      <object3D position={position}>
        <VRIconButton iconSrc={iconSrc} onClick={handleClick} />
      </object3D>
    </>
  );
};
