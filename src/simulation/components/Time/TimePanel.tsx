import { useFrame } from '@react-three/fiber';
import DateDisplay from './DateDisplay';
import TimeControls from './TimeControls';
import TimeDisplay from './TimeDisplay';

const TimePanel = () => {
  return (
    <div className="w-min-fit h-min-fit  flex h-fit w-fit flex-col self-center border-2 border-blue-500">
      <TimeDisplay />
      <DateDisplay />
      <TimeControls />
    </div>
  );
};

export default TimePanel;
