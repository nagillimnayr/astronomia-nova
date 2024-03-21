import { TimeControls } from '@/components/dom/hud/time-panel/time-controls/TimeControls';
import { TimescaleDisplay } from './TimescaleDisplay';
import { TimescaleControls } from './time-controls/TimescaleControls';
import { TimeDisplay } from './time-display/TimeDisplay';

//type TimePanelProps = {};
export const TimePanel = () => {
  return (
    <div className="sm:w-min-full h-min-fit pointer-events-none flex h-fit select-none flex-col items-center justify-start self-center rounded-lg border-2 border-border bg-muted p-2 sm:w-72">
      <TimeDisplay />
      <div className="z-10 -my-1 w-full">
        <TimeControls />
      </div>
      <div className="-my-2 w-full">
        <TimescaleDisplay />
      </div>
      <div className="-mt-2 w-full">
        <TimescaleControls />
      </div>
    </div>
  );
};
