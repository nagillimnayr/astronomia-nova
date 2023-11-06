import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  addSeconds,
  format,
  differenceInSeconds,
  startOfDay,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  parse,
} from 'date-fns';
import {
  type FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/dom/ui/popover';
import { Calendar } from '@/components/dom/ui/calendar';
import { useSelector } from '@xstate/react';
import { type SelectSingleEventHandler } from 'react-day-picker';
import { J2000 } from '@/constants';
import { Input } from '@/components/dom/ui/input';

const MIN_YEAR = 1900;
const MAX_YEAR = 2099;
const MIN_DATE_STR = `${MIN_YEAR}-01-01`;
const MAX_DATE_STR = `${MAX_YEAR}-01-01`;
const MIN_DATE = parse(MIN_DATE_STR, 'yyy*mm-dd', J2000);
const MAX_DATE = parse(MAX_DATE_STR, 'yyy*mm-dd', J2000);

export const DateDisplay = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const { refDate } = timeActor.getSnapshot()!.context;
  const dateRef = useRef<HTMLButtonElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null!);

  /* Subscribe to changes in useEffect so that the component wont re-render on
  state change, but we can update the view directly. */
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      const { date } = context;
      // if (!dateRef.current) return;
      // dateRef.current.textContent = format(date, 'PPP');
      inputRef.current.valueAsDate = date;
    });
    return () => subscription.unsubscribe();
  }, [timeActor]);

  const handleOpen = useCallback(() => {
    /* Pause when opening calendar. */
    timeActor.send({ type: 'PAUSE' });
  }, [timeActor]);

  const handleInput: FormEventHandler = useCallback(
    (event) => {
      const target = event.target as HTMLInputElement;
      const timeOfDay = target.valueAsDate;
      if (!timeOfDay) return;

      const { date } = timeActor.getSnapshot()!.context;

      const newDate = parse(target.value, 'yyyy-MM-dd', date);
      timeActor.send({ type: 'SET_DATE', date: newDate });
    },
    [timeActor]
  );

  return (
    <>
      {/* <Input
        ref={inputRef}
        type="date"
        onClick={handleOpen}
        onInput={handleInput}
        className="text-md inline-flex h-8 min-h-fit w-full min-w-fit select-none items-center justify-center py-0 text-center"
        min={'1950-01-01'}
        max={'2050-01-01'}
      ></Input> */}
      {/* <Popover>
        <PopoverTrigger className="bg-muted py-1" onClick={handleOpen}>
          <span
            ref={dateRef}
            className={
              'my-1 rounded-sm px-2 py-1 transition-colors hover:bg-subtle'
            }
          >
            {format(refDate, 'PPP')}
          </span>
        </PopoverTrigger>

        <CalendarPopover />
      </Popover> */}
    </>
  );
};

const CalendarPopover = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  // const date = useSelector(timeActor, (state) => state.context.date);

  const handleSelect: SelectSingleEventHandler = useCallback(
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

  const [selectedDate, setSelectedDate] = useState<Date>(J2000);
  const [month, setMonth] = useState<Date>(J2000);

  const dateRef = useRef<Date>(null!);
  dateRef.current = selectedDate;

  useEffect(() => {
    const subscription = timeActor.subscribe((state) => {
      const { date } = state.context;
      if (isSameDay(date, dateRef.current)) return;
      setSelectedDate(date);
      setMonth(date);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [timeActor]);

  return (
    <>
      <PopoverContent className="w-auto -translate-y-10 p-0">
        <Calendar
          mode="single"
          fixedWeeks
          month={month}
          selected={selectedDate}
          onSelect={handleSelect}
          onMonthChange={setMonth}
          initialFocus
          fromYear={MIN_YEAR}
          toYear={MAX_YEAR}
        />
      </PopoverContent>
    </>
  );
};
