import { cn } from '@/lib/cn';
import { type toggleMachine } from '@/state/xstate/toggle-machine/toggle-machine';
import * as Toolbar from '@radix-ui/react-toolbar';
import { useActor } from '@xstate/react';
import { type Context, useContext, PropsWithChildren } from 'react';
import { type InterpreterFrom } from 'xstate';

type Props = PropsWithChildren & {
  context: Context<InterpreterFrom<typeof toggleMachine>>;
};
export const ToggleItem = ({ children, context }: Props) => {
  const actor = useContext(context);
  const [state, send] = useActor(actor);
  const isActive = state.matches('active');
  return (
    <Toolbar.ToggleGroup
      className="inline-flex w-fit items-center justify-center "
      type="single"
      value={isActive ? 'toggle' : ''}
      onValueChange={() => {
        send('TOGGLE');
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
