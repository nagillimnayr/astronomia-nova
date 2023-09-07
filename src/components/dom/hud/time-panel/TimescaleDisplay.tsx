import { useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';

const TimescaleDisplay = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescale = timeActor.getSnapshot()!.context.timescale;
  const spanRef = useRef<HTMLSpanElement>(null!);

  const plural = Math.abs(timescale) === 1 ? 's' : '';
  const text = `${timescale} Hour${plural} / Second`;

  // Subscribe to state changes in useEffect so that the component wont rerender on state change, but we can update the view directly
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      if (!spanRef.current) return;
      const timescale = context.timescale;
      const plural = Math.abs(timescale) === 1 ? '' : 's';

      const text = `${context.timescale.toString()} Hour${plural} / Second`;
      spanRef.current.textContent = text;
    });

    // Unsubscribe on dismount.
    return () => subscription.unsubscribe();
  }, [timeActor]);

  return (
    <span className="w-min-fit flex flex-row justify-center whitespace-nowrap text-white">
      <span ref={spanRef}>{text}</span>
    </span>
  );
};

export default TimescaleDisplay;
