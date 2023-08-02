import DateDisplay from './DateDisplay';
import TimeControls from './time-controls/TimeControls';
import TimeDisplay from './TimeDisplay';
import TimescaleDisplay from './TimescaleDisplay';
//type TimePanelProps = {};
const TimePanel = () => {
  return (
    <div className="w-min-full h-min-full pointer-events-none flex h-full w-full flex-col items-center justify-end">
      <div className="w-min-fit h-min-fit pointer-events-none flex h-fit w-64 select-none flex-col items-center justify-start self-center rounded-lg border-2 bg-muted p-2">
        {/* <TimeDisplay /> */}
        <TimescaleDisplay />
        <DateDisplay />
        <TimeControls />
      </div>
    </div>
  );
};

export default TimePanel;
