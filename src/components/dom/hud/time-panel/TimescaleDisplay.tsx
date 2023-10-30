import { MachineContext } from '@/state/xstate/MachineProviders';
import { TimeUnit } from '@/state/xstate/time-machine/time-machine';
import { type MouseEvent, useCallback, useEffect, useRef } from 'react';

export const TimescaleDisplay = () => {
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

  const incrementTimescaleUnit = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      timeActor.send({ type: 'INCREMENT_TIMESCALE_UNIT' });
    },
    [timeActor]
  );

  const decrementTimescaleUnit = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      timeActor.send({ type: 'DECREMENT_TIMESCALE_UNIT' });
    },
    [timeActor]
  );

  return (
    <div className="pointer-events-auto flex h-fit w-fit min-w-full select-none flex-row items-center justify-center whitespace-nowrap px-4 text-center text-white">
      <button
        className={
          'icon-[mdi--menu-left]  mr-auto aspect-square h-6 w-6 hover:cursor-pointer'
        }
        onClick={decrementTimescaleUnit}
      />
      <span
        ref={timescaleSpanRef}
        className="border border-transparent align-middle"
      />
      <span
        ref={unitSpanRef}
        className="pointer-events-auto mx-[1px] inline-flex h-fit w-fit items-center justify-center rounded-md border-2 border-muted bg-opacity-20 px-1 text-center align-middle transition-colors hover:cursor-pointer hover:border-gray-800 hover:bg-gray-500"
        onClick={incrementTimescaleUnit}
      />
      <span className="border border-transparent">/&nbsp; Second</span>
      <button
        className={
          'icon-[mdi--menu-right] pointer-events-auto ml-auto aspect-square h-6 w-6 hover:cursor-pointer'
        }
        onClick={incrementTimescaleUnit}
      />
    </div>
  );
};
