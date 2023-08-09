import { cn } from '@/lib/cn';
import {
  autoUpdate,
  offset,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStatus,
} from '@floating-ui/react';
import { type PropsWithChildren, useState } from 'react';

type Props = PropsWithChildren;
export const SliderTooltip = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10)],
  });
  const hover = useHover(context, {
    restMs: 100,
  });
  const { isMounted, status } = useTransitionStatus(context, { duration: 300 });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
  return (
    <>
      {/** Trigger area inside of thumb. */}
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cn('h-full w-full rounded-full bg-transparent')}
      />
      {/** Floating tooltip. */}
      {isMounted && (
        <div
          data-status={status}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="text-md flex h-fit w-fit flex-row items-center justify-center rounded-md border border-white bg-card px-2 py-1 transition-all duration-300  data-[status=close]:opacity-0 data-[status=initial]:opacity-0  data-[status=open]:opacity-100"
        >
          <span className="text-md">{children}</span>
        </div>
      )}
    </>
  );
};
