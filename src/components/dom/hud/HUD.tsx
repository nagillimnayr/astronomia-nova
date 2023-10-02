import { EnterVRButton } from '@/components/canvas/vr/EnterVRButton';
import { cn } from '@/helpers/cn';
import { ClassNameValue } from 'tailwind-merge';
import { DetailsPanel } from './details-panel/DetailsPanel';
import DouglasLogo from './DouglasLogo';
import Outliner from './outliner/Outliner';
import { SettingsMenu } from './settings/SettingsMenu';
import { SurfaceViewDialog } from './surface-dialog/SurfaceViewDialog';
import TimePanel from './time-panel/TimePanel';

type Props = {
  className?: ClassNameValue;
};
export const HUD = ({ className }: Props) => {
  return (
    <>
      <div
        className={cn(
          'pointer-events-none absolute z-[3] h-full min-h-full w-full min-w-full select-none place-items-stretch',
          'grid grid-cols-[minmax(0,_20px)_repeat(5,_minmax(0,_1fr))_minmax(0,_20px)] grid-rows-[minmax(0,_20px)_repeat(5,_minmax(0,_1fr))_minmax(0,_20px)]',
          className
        )}
      >
        {/** Settings Button */}
        <div className="relative z-40 col-end-[-2] row-start-2 h-full w-full">
          <div className="pointer-events-auto absolute right-0 top-0 m-0 inline-flex h-fit w-fit items-center justify-center p-0">
            {/* <SettingsButton /> */}
            <SettingsMenu />
          </div>
        </div>

        {/** Settings Menu */}
        {/* <div className="relative z-50 col-end-[-2] row-start-2 h-full w-full">
         <div className="pointer-events-auto absolute right-1/2 top-0 m-0 inline-flex h-fit w-fit translate-x-1/2 items-center justify-center p-0"></div>
         <SettingsMenu />
         </div> */}

        {/** Outliner. */}
        <div className={'relative col-start-2 row-start-[3] row-end-[-3]'}>
          <div className="pointer-events-auto relative left-1/2 top-0 h-fit min-h-fit w-56 min-w-fit -translate-x-1/2 rounded-lg border-4 bg-muted px-2 ">
            <Outliner />
          </div>
        </div>

        {/** Details Panel. */}
        <div className={'relative col-end-[-2] row-start-[3]'}>
          <div className="pointer-events-auto relative left-1/2 top-0 h-fit w-fit -translate-x-1/2">
            <DetailsPanel />
          </div>
        </div>

        {/** Surface View Dialog. */}
        <div className={'relative z-50 col-start-4  col-end-5 row-start-[-4]'}>
          <div className="pointer-events-auto absolute left-1/2 top-0 h-fit  w-fit  -translate-x-1/2">
            <SurfaceViewDialog />
          </div>
        </div>

        {/** Time Panel. */}
        <div
          className={
            'relative z-40 col-start-4 col-end-5 row-span-1 row-start-[-3]'
          }
        >
          <div className="pointer-events-auto absolute bottom-0 left-1/2 h-fit w-fit -translate-x-1/2">
            <TimePanel />
          </div>
        </div>

        {/** Douglas Logo */}
        <div className={'relative col-start-2 row-end-[-2]'}>
          <div className="pointer-events-auto absolute bottom-0 left-0 h-fit w-fit">
            <DouglasLogo />
          </div>
        </div>

        {/** VR Button */}
        <div className={'relative col-end-[-2] row-end-[-2]'}>
          <div className="pointer-events-auto absolute bottom-0 right-1/2 h-fit w-fit translate-x-1/2">
            {/* <VRButton className="whitespace-nowrap" /> */}
            <EnterVRButton />
          </div>
        </div>

        {/** Debug Panel */}
        {/* <div className={'relative col-start-[4] col-end-[5] row-end-[3]'}>
         <div className="pointer-events-auto flex h-full w-full flex-col items-center justify-center">
         <DebugPanel />
         </div>
         </div> */}
      </div>
    </>
  );
};
