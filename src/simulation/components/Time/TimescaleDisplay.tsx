import { useSnapshot } from 'valtio';
import { useTimeStore } from '@/simulation/state/zustand/time-store';
import { useContext, useEffect, useRef } from 'react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

const TimescaleDisplay = () => {
  const rootStore = useContext(RootStoreContext);
  const rootActor = rootStore.rootMachine;

  const timeActor = useSelector(rootActor, ({ context }) => context.timeActor);
  const timescale = timeActor.getSnapshot()!.context.timescale;
  const spanRef = useRef<HTMLSpanElement>(null!);

  // Subscribe to state changes in useEffect so that the component wont rerender on state change, but we can update the view directly
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      if (!spanRef.current) return;
      spanRef.current.textContent = context.timescale.toString();
    });

    // Unsubscribe on dismount.
    return () => subscription.unsubscribe();
  }, []);

  return (
    <span className="w-min-fit flex flex-row justify-center whitespace-nowrap text-white">
      <span ref={spanRef}>{timescale}</span>&nbsp;Days / second
    </span>
  );
};

export default TimescaleDisplay;
