import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useContext, useEffect, useRef } from 'react';

const CamViewPortal = () => {
  const { uiService } = useContext(GlobalStateContext);
  const camViewRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    uiService.send({
      type: 'ASSIGN_CAM_VIEW_PORTAL_REF',
      camViewPortalRef: camViewRef,
    });
  }, [uiService]);

  return (
    <>
      <div
        ref={(portal) => {
          if (!portal) return;
          camViewRef.current = portal;
          uiService.send({
            type: 'SET_CAM_VIEW_PORTAL',
            camViewPortal: portal,
          });
        }}
        className="absolute left-0 top-0 z-10 flex h-60 w-80 flex-col items-center justify-start gap-2 rounded-sm  border-2 border-white bg-transparent p-4 text-muted-foreground opacity-50 "
      >
        <></>
      </div>
    </>
  );
};

export { CamViewPortal };
