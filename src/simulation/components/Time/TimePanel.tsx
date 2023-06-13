import { useFrame } from '@react-three/fiber';
import DateDisplay from './DateDisplay';
import TimeControls from './TimeControls';
import TimeDisplay from './TimeDisplay';
import TimescaleDisplay from './TimescaleDisplay';

const TimePanel = () => {
  return (
    <div className="w-min-fit h-min-fit  flex h-fit w-fit flex-col self-center border-2 border-blue-500">
      <TimeDisplay />
      <TimescaleDisplay />
      <DateDisplay />
      <TimeControls />
    </div>
  );
};

export default TimePanel;
