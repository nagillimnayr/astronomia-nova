import { cn } from '@/lib/cn';
import {
  autoUpdate,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import { type PropsWithChildren, useState } from 'react';

type Props = PropsWithChildren;
export const SliderTooltip = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const hover = useHover(context);

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
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="text-md h-fit w-fit flex-row items-center justify-center  rounded-md border-white bg-card p-2"
        >
          <span className="text-md">{children}</span>
        </div>
      )}
    </>
  );
};
