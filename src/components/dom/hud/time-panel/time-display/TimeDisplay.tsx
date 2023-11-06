import { MachineContext } from '@/state/xstate/MachineProviders';
import { format, isAfter, isBefore, parse } from 'date-fns';
import { FormEventHandler, useCallback, useEffect, useRef } from 'react';
import { TimeOfDayDisplay } from './TimeOfDayDisplay';
import { DateDisplay } from './DateDisplay';
import { Input } from '@/components/dom/ui/input';
import { J2000 } from '@/constants';

const MIN_YEAR = 1900;
const MAX_YEAR = 2099;
const MIN_DATE_STR = `${MIN_YEAR}-01-01`;
const MAX_DATE_STR = `${MAX_YEAR}-01-01`;
const MIN_DATE = parse(MIN_DATE_STR, 'yyyy-mm-dd', J2000);
const MAX_DATE = parse(MAX_DATE_STR, 'yyyy-mm-dd', J2000);

export const TimeDisplay = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const dateInputRef = useRef<HTMLInputElement>(null!);
  const timeOfDayInputRef = useRef<HTMLInputElement>(null!);

  const handleOpen = useCallback(() => {
    /* Pause when opening calendar. */
    timeActor.send({ type: 'PAUSE' });
  }, [timeActor]);

  const handleInput: FormEventHandler = useCallback(
    (event) => {
      const target = event.target as HTMLInputElement;
      if (!target.valueAsDate) return;

      const timeOfDayInput = timeOfDayInputRef.current;
      const dateInput = dateInputRef.current;
      const { date } = timeActor.getSnapshot()!.context;

      let newDate = parse(dateInput.value, 'yyyy-MM-dd', date);

      /* Clamp date. */
      if (isBefore(newDate, MIN_DATE)) {
        console.log('before');
      }
      if (isAfter(newDate, MAX_DATE)) {
        console.log('after');
      }
      // console.log(newDate);
      // console.log('min date:', MIN_DATE);
      // console.log('max date:', MAX_DATE);
      newDate = isBefore(newDate, MIN_DATE) ? MIN_DATE : newDate;
      newDate = isAfter(newDate, MAX_DATE) ? MAX_DATE : newDate;

      const newDateAndTime = parse(timeOfDayInput.value, 'HH:mm:ss', newDate);
      timeActor.send({ type: 'SET_DATE', date: newDateAndTime });
    },
    [timeActor]
  );

  /* Subscribe to changes in useEffect so that the component wont re-render on
  state change, but we can update the view directly. */
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      const { date } = context;
      dateInputRef.current.valueAsDate = date;
      timeOfDayInputRef.current.value = format(date, 'HH:mm:ss');
    });
    return () => subscription.unsubscribe();
  }, [timeActor]);

  return (
    <div className="pointer-events-auto flex w-3/5 select-none flex-col items-center gap-1 text-white">
      {/* <TimeOfDayDisplay />
      <DateDisplay /> */}

      <Input
        ref={timeOfDayInputRef}
        className="text-md inline-flex h-8 min-h-fit w-full min-w-fit select-none items-center justify-center py-0 text-center"
        type="time"
        step={1}
        onClick={handleOpen}
        onInput={handleInput}
      ></Input>

      <Input
        ref={dateInputRef}
        type="date"
        onClick={handleOpen}
        onInput={handleInput}
        className={
          'text-md inline-flex h-8 min-h-fit w-full min-w-fit select-none items-center justify-center py-0 text-center'
        }
        min={MIN_DATE_STR}
        max={MAX_DATE_STR}
      ></Input>
    </div>
  );
};
