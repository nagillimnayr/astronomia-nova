import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { useEffect } from 'react';

export function useEventManager() {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor, visibilityActor, timeActor } =
    MachineContext.useSelector(({ context }) => context);
  const { trajectories } = useSelector(
    visibilityActor,
    ({ context }) => context
  );

  useEffect(() => {
    const onPause = () => {
      timeActor.send({ type: 'PAUSE' });
    };
    const onUnpause = () => {
      timeActor.send({ type: 'UNPAUSE' });
    };

    const enableTrajectoryVisibility = () => {
      trajectories.send({ type: 'ENABLE' });
    };
    const disableTrajectoryVisibility = () => {
      trajectories.send({ type: 'DISABLE' });
    };

    const { eventManager } = rootActor.getSnapshot()!.context;
    eventManager.addEventListener('PAUSE', onPause);
    eventManager.addEventListener('UNPAUSE', onUnpause);

    eventManager.addEventListener(
      'ENABLE_TRAJECTORY_VISIBILITY',
      enableTrajectoryVisibility
    );
    eventManager.addEventListener(
      'DISABLE_TRAJECTORY_VISIBILITY',
      disableTrajectoryVisibility
    );

    return () => {
      eventManager.removeEventListener('PAUSE', onPause);
      eventManager.removeEventListener('UNPAUSE', onUnpause);
      eventManager.removeEventListener(
        'ENABLE_TRAJECTORY_VISIBILITY',
        enableTrajectoryVisibility
      );
      eventManager.removeEventListener(
        'DISABLE_TRAJECTORY_VISIBILITY',
        disableTrajectoryVisibility
      );
    };
  }, [rootActor, trajectories]);
}
