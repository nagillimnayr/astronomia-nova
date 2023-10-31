import { MachineContext } from '@/state/xstate/MachineProviders';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';

export const TimeOfDayDisplay = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const { refDate } = timeActor.getSnapshot()!.context;
  const timeRef = useRef<HTMLSpanElement>(null!);

  /* Subscribe to changes in useEffect so that the component wont re-render on
  state change, but we can update the view directly. */
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      if (!timeRef.current) return;
      const { date } = context;
      timeRef.current.textContent = format(date, 'hh:mm:ss a OOOO');
    });
    return () => subscription.unsubscribe();
  }, [timeActor]);

  return (
    <>
      <span ref={timeRef}>{format(refDate, 'hh:mm:ss a')}</span>
    </>
  );
};