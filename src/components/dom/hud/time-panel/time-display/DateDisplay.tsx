import { MachineContext } from '@/state/xstate/MachineProviders';
import { addSeconds, format } from 'date-fns';
import { useEffect, useRef } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/dom/ui/popover';
import { Calendar } from '@/components/dom/ui/calendar';

export const DateDisplay = () => {
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
      <Popover>
        <PopoverTrigger>
          <span
            ref={dateRef}
            className={
              'rounded-sm px-2 transition-colors hover:cursor-pointer hover:bg-subtle'
            }
          >
            {format(refDate, 'PPP')}
          </span>
        </PopoverTrigger>

        <PopoverContent>
          <Calendar
            mode="single"
            selected={refDate}
            // onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
