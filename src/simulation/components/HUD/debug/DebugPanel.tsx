import { MachineContext } from '@/state/xstate/MachineProviders';
import { useActor, useSelector } from '@xstate/react';
import { useRef } from 'react';

export const DebugPanel = () => {
  const spanRef = useRef<HTMLSpanElement>(null!);

  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  const [state, send] = useActor(cameraActor);
  const controller = state.context.controls;
  if (!controller) return;
  const camera = controller.camera;
  const camRotation = camera.rotation;
  const { x, y, z } = camRotation;
  return (
    <>
      <div className="m-4 flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-border bg-background text-foreground">
        <span>{'camera rotation:'}</span>
        <span>
          {`{ x: ${x.toFixed(2)},   y: ${y.toFixed(2)},   z: ${z.toFixed(2)} }`}
        </span>
      </div>
    </>
  );
};