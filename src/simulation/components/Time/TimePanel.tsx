import TimeControls from './TimeControls';
import TimeDisplay from './TimeDisplay';

const TimePanel = () => {
  return (
    <div className="w-min-fit h-min-fit  flex h-fit w-fit flex-col self-center border-2 border-blue-500">
      <TimeDisplay />
      <TimeControls />
    </div>
  );
};

export default TimePanel;
