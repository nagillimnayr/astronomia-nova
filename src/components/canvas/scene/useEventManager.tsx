import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { useEffect } from 'react';

export function useEventManager() {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor, visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const { trajectories } = useSelector(
    visibilityActor,
    ({ context }) => context
  );

  useEffect(() => {
    const enableTrajectoryVisibility = () => {
      trajectories.send({ type: 'ENABLE' });
    };
    const disableTrajectoryVisibility = () => {
      trajectories.send({ type: 'DISABLE' });
    };

    const { eventManager } = rootActor.getSnapshot()!.context;
    eventManager.addEventListener(
      'ENABLE_TRAJECTORY_VISIBILITY',
      enableTrajectoryVisibility
    );
    eventManager.addEventListener(
      'DISABLE_TRAJECTORY_VISIBILITY',
      disableTrajectoryVisibility
    );

    return () => {
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
