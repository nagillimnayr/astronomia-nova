import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { useCallback } from 'react';
import { type Vector3Tuple } from 'three';
import { VRIconButton } from '../../vr-ui-components/VRIconButton';

type VRPauseButtonProps = {
  position?: Vector3Tuple;
};
export const VRPauseButton = ({ position = [0, 0, 0] }: VRPauseButtonProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const isPaused = useSelector(timeActor, (state) => state.matches('paused'));

  // Events handlers.
  const handleClick = useCallback(() => {
    const isPaused = timeActor.getSnapshot()!.matches('paused');
    const type = isPaused ? 'UNPAUSE' : 'PAUSE';
    timeActor.send({ type });
  }, [timeActor]);

  const iconSrc = isPaused ? 'icons/MdiPlay.svg' : 'icons/MdiPause.svg';

  return (
    <>
      <object3D position={position}>
        <VRIconButton iconSrc={iconSrc} onClick={handleClick} />
      </object3D>
    </>
  );
};
