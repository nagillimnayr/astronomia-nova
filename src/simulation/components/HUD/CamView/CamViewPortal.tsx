import { MachineContext } from '@/state/xstate/MachineProviders';
import { useContext, useEffect, useRef } from 'react';

const CamViewPortal = () => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const camViewRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    uiActor.send({
      type: 'ASSIGN_CAM_VIEW_PORTAL_REF',
      camViewPortalRef: camViewRef,
    });
  }, [uiActor]);

  return (
    <>
      <div
        ref={(portal) => {
          if (!portal) return;
          camViewRef.current = portal;
          uiActor.send({
            type: 'SET_CAM_VIEW_PORTAL',
            camViewPortal: portal,
          });
        }}
        className="absolute left-0 top-0 z-10 flex h-60 w-80 flex-col items-center justify-start gap-2 rounded-sm  border-2 border-transparent bg-transparent p-4 text-muted-foreground opacity-50 "
      >
        <></>
      </div>
    </>
  );
};

export { CamViewPortal };
