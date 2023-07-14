import { useSnapshot } from 'valtio';
import { timeState } from '@/simulation/state/TimeState';
import { useTimeStore } from '@/simulation/state/zustand/time-store';
import { useEffect, useRef } from 'react';

const TimescaleDisplay = () => {
  // const snap = useSnapshot(timeState);

  const timescale = useTimeStore.getState().timescale;

  const spanRef = useRef<HTMLSpanElement>(null!);

  // subscribe to state changes in useEffect so that the component wont rerender on state change, but we can update the view directly
  useEffect(() => {
    const unsubscribe = useTimeStore.subscribe(
      (state) => state.timescale,
      (timescale) => {
        if (!spanRef.current) return;
        spanRef.current.textContent = timescale.toString();
      }
    );

    // unsubscribe on dismount
    return () => unsubscribe();
  }, []);

  return (
    <span className="w-min-fit flex flex-row justify-center whitespace-nowrap text-white">
      <span ref={spanRef}>{timescale}</span>&nbsp;Days / second
    </span>
  );
};

export default TimescaleDisplay;
