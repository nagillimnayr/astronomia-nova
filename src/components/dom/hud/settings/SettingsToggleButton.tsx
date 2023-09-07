import { cn } from '@/helpers/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type visibilityMachine } from '@/state/xstate/visibility-machine/visibility-machine';
import { useSelector } from '@xstate/react';
import { type PropsWithChildren, useCallback, useEffect } from 'react';
import { type ContextFrom } from 'xstate';

type Props = PropsWithChildren & {
  // service: InterpreterFrom<typeof toggleMachine>;
  // selector: (state: StateFrom<typeof visibilityMachine>) => boolean;
  target: keyof ContextFrom<typeof visibilityMachine>;
  defaultOff?: boolean;
};
export const SettingsToggleButton = ({
  children,
  target,
  defaultOff,
}: Props) => {
  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const actor = useSelector(visibilityActor, (state) => state.context[target]);
  const isActive = useSelector(actor, (state) => state.matches('active'));

  useEffect(() => {
    if (defaultOff) {
      actor.send({ type: 'DISABLE' });
    }
  }, [actor, defaultOff, target]);

  const handleClick = useCallback(() => {
    actor.send({ type: 'TOGGLE' });
  }, [actor]);
  return (
    <button
      onClick={handleClick}
      data-state={isActive ? 'on' : 'off'}
      className={cn(
        'inline-flex h-fit w-fit items-center justify-center rounded-sm border-2 p-1 transition-all hover:bg-subtle',
        'data-[state=on]:border-neutral-600 data-[state=on]:bg-subtle data-[state=on]:hover:border-foreground data-[state=on]:hover:border-opacity-50 data-[state=on]:hover:opacity-80'
      )}
    >
      {children}
    </button>
  );
};
