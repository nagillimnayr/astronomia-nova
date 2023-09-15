import { MachineContext } from '@/state/xstate/MachineProviders';
import { TimeUnit } from '@/state/xstate/time-machine/time-machine';
import { useCallback, useEffect, useRef } from 'react';

const TimescaleDisplay = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescaleSpanRef = useRef<HTMLSpanElement>(null!);
  const unitSpanRef = useRef<HTMLSpanElement>(null!);

  const updateText = useRef<() => void>(null!);
  updateText.current = useCallback(() => {
    const timescaleSpan = timescaleSpanRef.current;
    const unitSpan = unitSpanRef.current;
    if (!timescaleSpan || !unitSpan) return;
    const { timescale, timescaleUnit } = timeActor.getSnapshot()!.context;
    const plural = Math.abs(timescale) === 1 ? '' : 's';
    const unitStr = TimeUnit[timescaleUnit]; // Reverse mapping to get name of enum.
    timescaleSpan.textContent = timescale.toString();
    unitSpan.textContent = unitStr + plural;
  }, [timeActor]);

  // Subscribe to state changes in useEffect so that the component wont rerender on state change, but we can update the view directly.
  useEffect(() => {
    const subscription = timeActor.subscribe((state) => {
      const event = state.event.type;
      if (event === 'UPDATE') {
        return;
      }
      updateText.current();
    });

    // Unsubscribe on dismount.
    return () => subscription.unsubscribe();
  }, [timeActor]);

  useEffect(() => {
    updateText.current();
  }, []);

  const handleClick = useCallback(() => {
    timeActor.send({ type: 'INCREMENT_TIMESCALE_UNIT' });
  }, [timeActor]);

  return (
    <span className="w-min-fit flex flex-row justify-center whitespace-nowrap text-white">
      <span ref={timescaleSpanRef} />
      <span
        ref={unitSpanRef}
        className="pointer-events-auto mx-[1px] rounded-md border-2 border-muted bg-opacity-20 px-1 transition-colors hover:border-gray-800 hover:bg-gray-500"
        onClick={handleClick}
      />
      {'/ Second'}
    </span>
  );
};

export default TimescaleDisplay;
