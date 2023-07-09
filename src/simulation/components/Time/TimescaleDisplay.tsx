import { useSnapshot } from 'valtio';
import { timeState } from '@/simulation/state/TimeState';

const TimescaleDisplay = () => {
  const snap = useSnapshot(timeState);
  return (
    <span className="w-min-fit flex flex-row justify-center whitespace-nowrap text-white">
      <span>{snap.timescale}</span>&nbsp;Days / second
    </span>
  );
};

export default TimescaleDisplay;
