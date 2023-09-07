import { SurfaceViewButton } from '../SurfaceViewButton';
import { SurfaceViewDialog } from '../SurfaceViewDialog';

export const SurfaceViewDialogStory = () => {
  // const { uiActor } = MachineContext.useSelector(({ context }) => context);
  // const { surfaceDialogActor } = useSelector(uiActor, ({ context }) =>
  // context);
  return (
    <>
      <div className="absolute left-10 top-10 p-0">
        <SurfaceViewButton />
      </div>
      <div className="grid h-screen w-full place-items-center ">
        <SurfaceViewDialog />
      </div>
    </>
  );
};
