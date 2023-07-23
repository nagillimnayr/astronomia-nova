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
      className="inline-flex aspect-square items-center justify-center border"
      type="single"
      value={isActive ? 'toggle' : ''}
      onValueChange={() => {
        send('TOGGLE');
      }}
    >
      <Toolbar.ToggleItem value="toggle">{children}</Toolbar.ToggleItem>
    </Toolbar.ToggleGroup>
  );
};
