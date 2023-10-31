import { TimeControls } from '@/components/dom/hud/time-panel/time-controls/TimeControls';
import { TimescaleDisplay } from './TimescaleDisplay';
import { TimescaleControls } from './time-controls/TimescaleControls';
import { TimeDisplay } from './time-display/TimeDisplay';

//type TimePanelProps = {};
export const TimePanel = () => {
  return (
    <div className="w-min-full h-min-fit pointer-events-none flex h-fit w-72 select-none flex-col items-center justify-start self-center rounded-lg border-2 border-border bg-muted p-2">
      <TimeDisplay />
      <TimeControls />
      <div className="-mb-2 w-full">
        <TimescaleDisplay />
      </div>
      <div className="-mt-2 w-full">
        <TimescaleControls />
      </div>
    </div>
  );
};
