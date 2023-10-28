import TimeControls from '@/components/dom/hud/time-panel/time-controls/TimeControls';
import DateDisplay from './DateDisplay';
import TimescaleDisplay from './TimescaleDisplay';
import { TimescaleControls } from './time-controls/TimescaleControls';

//type TimePanelProps = {};
const TimePanel = () => {
  return (
    <div className="w-min-full h-min-fit pointer-events-none flex h-fit w-72 select-none flex-col items-center justify-start self-center rounded-lg border-2 border-border bg-muted p-2">
      <TimescaleDisplay />
      <TimescaleControls />
      <DateDisplay />
      <TimeControls />
    </div>
  );
};

export default TimePanel;
