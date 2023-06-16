import { format } from 'date-fns';
import { useSnapshot } from 'valtio';
import { timeState } from '~/simulation/state/TimeState';
const DateDisplay = () => {
  const snap = useSnapshot(timeState);
  return (
    <div className="flex flex-col items-center text-white">
      {/* hours */}
      <p>{format(snap.date, 'hh:mm:ss a')}</p>
      {/* date */}
      <p>{format(snap.date, 'PPP')}</p>
    </div>
  );
};

export default DateDisplay;
