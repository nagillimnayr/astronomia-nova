import { Label } from '@/components/ui/label';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type visibilityMachine } from '@/state/xstate/visibility-machine/visibility-machine';
import { useSelector } from '@xstate/react';
import { type ContextFrom } from 'xstate';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useCallback, useEffect } from 'react';

type CheckboxProps = {
  label: string;
  target: keyof ContextFrom<typeof visibilityMachine>;
  defaultOff?: boolean;
};
export const SettingsCheckbox = ({
  label,
  target,
  defaultOff,
}: CheckboxProps) => {
  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const actor = useSelector(visibilityActor, (state) => state.context[target]);
  const isActive = useSelector(actor, (state) => state.matches('active'));

  const handleCheckedChange = useCallback(
    (checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') {
        return;
      }
      if (!checked) {
        actor.send({ type: 'DISABLE' });
      }
      if (checked) {
        actor.send({ type: 'ENABLE' });
      }
    },
    [actor]
  );
  useEffect(() => {
    if (defaultOff) {
      actor.send({ type: 'DISABLE' });
    }
  }, [actor, defaultOff]);

  return (
    <>
      <div className="flex h-fit w-full flex-row items-center justify-start gap-2">
        <Checkbox.Root
          id={label}
          checked={isActive}
          onCheckedChange={handleCheckedChange}
          className="flex aspect-square h-5 items-center justify-center rounded-sm border border-foreground p-0"
        >
          <Checkbox.Indicator className="inline-flex aspect-square h-full items-start justify-center ">
            <span className="icon-[mdi--check] inline-flex aspect-square items-start justify-start data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <Label htmlFor={label} className="m-0 h-full p-0">
          <span className="m-0 h-full p-0 align-middle">{label}</span>
        </Label>
      </div>
    </>
  );
};
