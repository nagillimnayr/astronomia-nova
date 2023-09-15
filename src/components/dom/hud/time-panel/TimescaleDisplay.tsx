import { MachineContext } from '@/state/xstate/MachineProviders';
import { TimeUnit } from '@/state/xstate/time-machine/time-machine';
import { useCallback, useEffect, useRef } from 'react';

const TimescaleDisplay = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescaleSpanRef = useRef<HTMLSpanElement>(null!);

  const updateText = useRef<() => void>(null!);
  updateText.current = useCallback(() => {
    const timescaleSpan = timescaleSpanRef.current;
    if (!timescaleSpan) return;
    const { timescale, timescaleUnit } = timeActor.getSnapshot()!.context;
    const plural = Math.abs(timescale) === 1 ? '' : 's';
    const unitStr = TimeUnit[timescaleUnit]; // Reverse mapping to get name of enum.
    const text = `${timescale.toString()} ${unitStr}${plural} `;
    timescaleSpan.textContent = text;
  }, [timeActor]);

  // Subscribe to state changes in useEffect so that the component wont rerender on state change, but we can update the view directly.
  useEffect(() => {
    const subscription = timeActor.subscribe((state) => {
      const event = state.event.type;
      if (
        event !== 'DECREMENT_TIMESCALE' &&
        event !== 'INCREMENT_TIMESCALE' &&
        event !== 'SET_TIMESCALE' &&
        event !== 'SET_TIMESCALE_UNIT'
      ) {
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

  return (
    <span className="w-min-fit flex flex-row justify-center whitespace-nowrap text-white">
      <span ref={timescaleSpanRef} />
      &nbsp;{'/ Second'}
    </span>
  );
};

export default TimescaleDisplay;
