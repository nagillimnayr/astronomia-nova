import { cn } from '@/helpers/cn';

import { type PropsWithChildren, useCallback, useRef } from 'react';
import { useMachine } from '@xstate/react';
import { dialogMachine } from '@/state/xstate/ui-machine/dialog-machine/dialog-machine';
import { gsap } from 'gsap';

type Props = PropsWithChildren;
export const SliderTooltip = ({ children }: Props) => {
  const ref = useRef<HTMLDivElement>(null!);

  const openTooltip = useCallback(() => {
    return new Promise<void>((resolve) => {
      const div = ref.current;
      div.style.visibility = 'visible';
      div.style.display = 'flex';
      gsap.to(div, {
        duration: 0.3,
        opacity: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          setTimeout(resolve, 500);
        },
      });
    });
  }, []);

  const closeTooltip = useCallback(() => {
    return new Promise<void>((resolve) => {
      const div = ref.current;
      gsap.to(div, {
        duration: 0.3,
        opacity: 0,
        ease: 'power2.inOut',
        onComplete: () => {
          div.style.display = 'none';
          resolve();
        },
      });
    });
  }, []);

  const [state, send, actor] = useMachine(dialogMachine, {
    services: {
      openDialog: openTooltip,
      closeDialog: closeTooltip,
    },
  });

  return (
    <>
      {/** Trigger area inside of thumb. */}
      <span
        onPointerEnter={() => send({ type: 'OPEN' })}
        onPointerLeave={() => send({ type: 'CLOSE' })}
        className={cn('h-full w-full rounded-full bg-transparent')}
      />

      {/** Floating tooltip. */}
      <div
        ref={ref}
        data-state={state.value}
        className={cn(
          'text-md visible absolute top-full z-50 flex h-fit w-fit translate-y-2 flex-row items-center justify-center rounded-md border border-white bg-card px-2 py-1 transition-all duration-300',
          state.matches('closed') && 'hidden'
        )}
      >
        <span className="text-md">{children}</span>
      </div>
    </>
  );
};
