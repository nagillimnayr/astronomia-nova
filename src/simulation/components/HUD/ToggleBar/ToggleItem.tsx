import { cn } from '@/lib/cn';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { type visibilityMachine } from '@/state/xstate/visibility-machine/visibility-machine';
import * as Toolbar from '@radix-ui/react-toolbar';
import { useSelector } from '@xstate/react';
import { useEffect, type PropsWithChildren, useContext } from 'react';
import { type ContextFrom } from 'xstate';

type Props = PropsWithChildren & {
  // service: InterpreterFrom<typeof toggleMachine>;
  // selector: (state: StateFrom<typeof visibilityMachine>) => boolean;
  target: keyof ContextFrom<typeof visibilityMachine>;
  defaultOff?: boolean;
};
export const ToggleItem = ({ children, target, defaultOff }: Props) => {
  const { visibilityService } = useContext(GlobalStateContext);
  const actor = useSelector(
    visibilityService,
    (state) => state.context[target]
  );
  const isActive = useSelector(actor, (state) => state.matches('active'));

  useEffect(() => {
    if (defaultOff) {
      actor.send({ type: 'DISABLE' });
    }
  }, [actor, defaultOff, target]);

  return (
    <Toolbar.ToggleGroup
      className="inline-flex w-fit items-center justify-center "
      type="single"
      value={isActive ? 'toggle' : ''}
      onValueChange={() => {
        actor.send({ type: 'TOGGLE' });
      }}
    >
      <Toolbar.ToggleItem
        value="toggle"
        className={cn(
          'inline-flex h-fit w-fit items-center justify-center rounded-sm border-2 p-2 transition-all hover:bg-subtle',
          'data-[state=on]:border-neutral-600 data-[state=on]:bg-subtle data-[state=on]:hover:border-foreground data-[state=on]:hover:border-opacity-50 data-[state=on]:hover:opacity-80'
        )}
      >
        {children}
      </Toolbar.ToggleItem>
    </Toolbar.ToggleGroup>
  );
};
