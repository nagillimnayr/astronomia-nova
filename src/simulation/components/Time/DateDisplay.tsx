import { format } from 'date-fns';
import { useSnapshot } from 'valtio';
import { timeState } from '@/simulation/state/TimeState';
import { useEffect, useRef } from 'react';
import { useTimeStore } from '@/simulation/state/zustand/time-store';
const DateDisplay = () => {
  // const snap = useSnapshot(timeState);

  const startDate = useTimeStore((state) => state.refDate);
  const hoursRef = useRef<HTMLSpanElement>(null!);
  const dateRef = useRef<HTMLSpanElement>(null!);

  // subscribe to changes to timeElapsed in useEffect so that the component wont rerender on state change, but we can update the view directly.
  useEffect(() => {
    const unsubscribe = useTimeStore.subscribe(
      (state) => state.timeElapsed,
      (timeElapsed) => {
        if (!hoursRef.current || !dateRef.current) return;
        const date = useTimeStore.getState().getCurrentDate();
        hoursRef.current.textContent = format(date, 'hh:mm:ss a');
        dateRef.current.textContent = format(date, 'PPP');
      }
    );
    return () => unsubscribe();
  }, []);
  return (
    <div className="flex flex-col items-center text-white">
      {/* hours */}
      <span ref={hoursRef}>{format(startDate, 'hh:mm:ss a')}</span>
      {/* date */}
      <span ref={dateRef}>{format(startDate, 'PPP')}</span>
    </div>
  );
};

export default DateDisplay;
