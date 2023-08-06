import { cn } from '@/lib/cn';
import TimePanel from '../Time/TimePanel';
import { DetailsPanel } from './DetailsPanel/DetailsPanel';
import DouglasLogo from './DouglasLogo';
import { CamViewPortal } from './CamView/CamViewPortal';
import Outliner from '@/components/Outliner/Outliner';

type Props = {
  className: string;
};
export const HUD = ({ className }: Props) => {
  return (
    <>
      <div
        className={cn(
          'pointer-events-none absolute z-[3] grid h-full min-h-full w-full min-w-full grid-cols-[minmax(0,_0.5fr)_repeat(7,_minmax(0,_2fr))_minmax(0,_0.5fr)] grid-rows-[minmax(0,_0.5fr)_repeat(5,_minmax(0,_2fr))_minmax(0,_0.5fr)]',
          className
        )}
      >
        {/* <CamViewPortal /> */}

        <div className="pointer-events-auto absolute left-0 top-0 col-start-2 row-start-3 h-fit w-64 min-w-fit  select-none rounded-lg bg-muted p-5">
          <Outliner />
        </div>
        <div className="pointer-events-auto absolute right-0 top-0 col-end-[-2] row-start-3">
          <DetailsPanel />
        </div>

        <div className="pointer-events-auto col-start-5 row-end-[-1]">
          <TimePanel />
        </div>

        <DouglasLogo />
      </div>
    </>
  );
};
