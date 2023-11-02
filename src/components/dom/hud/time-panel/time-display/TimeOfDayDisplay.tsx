import { Input } from '@/components/dom/ui/input';
import { J2000 } from '@/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { format, parse } from 'date-fns';
import { FormEventHandler, useCallback, useEffect, useRef } from 'react';

export const TimeOfDayDisplay = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const timeRef = useRef<HTMLSpanElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null!);

  /* Subscribe to changes in useEffect so that the component wont re-render on
  state change, but we can update the view directly. */
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      const { date } = context;
      // timeRef.current.textContent = format(date, 'hh:mm:ss a OOOO');
      inputRef.current.value = format(date, 'HH:mm:ss');
    });
    return () => subscription.unsubscribe();
  }, [timeActor]);

  const handleInput: FormEventHandler = useCallback(
    (event) => {
      const target = event.target as HTMLInputElement;
      const timeOfDay = target.valueAsDate;
      if (!timeOfDay) return;
      // console.log('time of day:', timeOfDay);
      // console.log('date as number:', target.valueAsNumber);

      const { date } = timeActor.getSnapshot()!.context;

      const newDate = parse(target.value, 'HH:mm:ss', date);
      console.log('new date: ', newDate);
      // timeActor.send({ type: 'SET_TIME_OF_DAY', timeOfDay });
      timeActor.send({ type: 'SET_DATE', date: newDate });
    },
    [timeActor]
  );

  return (
    <>
      {/* <div className="flex select-none flex-col items-center justify-center gap-2 px-1 py-1" > */}
      {/* <span ref={timeRef}>{format(J2000, 'hh:mm:ss a')}</span> */}
      <Input
        ref={inputRef}
        className="text-md inline-flex h-8 min-h-fit w-full min-w-fit select-none items-center justify-center py-0 text-center"
        type="time"
        step={1}
        onInput={handleInput}
      ></Input>
      {/* </div> */}
    </>
  );
};
