import { MachineContext } from '@/state/xstate/MachineProviders';
import { addSeconds, format, differenceInSeconds, startOfDay } from 'date-fns';
import { useCallback, useEffect, useRef } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/dom/ui/popover';
import { Calendar } from '@/components/dom/ui/calendar';
import { useSelector } from '@xstate/react';
import { type SelectSingleEventHandler } from 'react-day-picker';

export const DateDisplay = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const { refDate } = timeActor.getSnapshot()!.context;
  const dateRef = useRef<HTMLButtonElement>(null!);

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

  const handleOpen = useCallback(() => {
    /* Pause when opening calendar. */
    timeActor.send({ type: 'PAUSE' });
  }, [timeActor]);

  return (
    <>
      <Popover>
        <PopoverTrigger onClick={handleOpen}>
          <span
            ref={dateRef}
            className={'rounded-sm px-2 transition-colors hover:bg-subtle'}
          >
            {format(refDate, 'PPP')}
          </span>
        </PopoverTrigger>

        <CalendarPopover />
      </Popover>
    </>
  );
};

const CalendarPopover = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const date = useSelector(timeActor, (state) => state.context.date);

  const setDate: SelectSingleEventHandler = useCallback(
    (day) => {
      if (!day) return;
      const { date } = timeActor.getSnapshot()!.context;

      /* Preserve the time of day. */
      const timeOfDayInSeconds = differenceInSeconds(date, startOfDay(date));
      const newDate = addSeconds(day, timeOfDayInSeconds);

      timeActor.send({ type: 'SET_DATE', date: newDate });
    },
    [timeActor]
  );

  return (
    <>
      <PopoverContent className="w-auto -translate-y-10 p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </>
  );
};
