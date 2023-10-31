import { MachineContext } from '@/state/xstate/MachineProviders';
import { addSeconds, format } from 'date-fns';
import { useEffect, useRef } from 'react';

export const DateDisplay = () => {
  return (
    <div className="pointer-events-auto flex select-none flex-col items-center text-white">
      <TimeText />
      <DateText />
    </div>
  );
};

const DateText = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const { refDate } = timeActor.getSnapshot()!.context;
  const dateRef = useRef<HTMLSpanElement>(null!);

  /* Subscribe to changes in useEffect so that the component wont re-render on
  state change, but we can update the view directly. */
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      if (!dateRef.current) return;
      const { date } = context;
      dateRef.current.textContent = format(date, 'PPP');
    });
    return () => subscription.unsubscribe();
  }, [timeActor]);

  return (
    <>
      <span
        ref={dateRef}
        className={'rounded-sm px-2 transition-colors hover:bg-subtle'}
      >
        {format(refDate, 'PPP')}
      </span>
    </>
  );
};
const TimeText = () => {
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
