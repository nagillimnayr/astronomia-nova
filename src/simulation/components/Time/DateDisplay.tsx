import { format } from 'date-fns';
import { useSnapshot } from 'valtio';
import { useContext, useEffect, useRef } from 'react';
import { useTimeStore } from '@/simulation/state/zustand/time-store';
import { useSelector } from '@xstate/react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
const DateDisplay = () => {
  const { rootActor } = useContext(GlobalStateContext);
  const timeActor = useSelector(rootActor, ({ context }) => context.timeActor);

  const { refDate } = timeActor.getSnapshot()!.context;
  const hoursRef = useRef<HTMLSpanElement>(null!);
  const dateRef = useRef<HTMLSpanElement>(null!);

  // Subscribe to changes in useEffect so that the component wont re-render on state change, but we can update the view directly.
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      if (!hoursRef.current || !dateRef.current) return;
      const { date } = context;
      hoursRef.current.textContent = format(date, 'hh:mm:ss a');
      dateRef.current.textContent = format(date, 'PPP');
    });

    return () => subscription.unsubscribe();
  }, [timeActor]);
  return (
    <div className="flex flex-col items-center text-white">
      {/* hours */}
      <span ref={hoursRef}>{format(refDate, 'hh:mm:ss a')}</span>
      {/* date */}
      <span ref={dateRef}>{format(refDate, 'PPP')}</span>
    </div>
  );
};

export default DateDisplay;
