import { cn } from '@/lib/cn';
import { MouseEventHandler, useCallback, useState } from 'react';
import { ClassNameValue } from 'tailwind-merge';

type Props = {
  name: string;
  className?: ClassNameValue;
};
export const VisibilityToggleButton = ({ name, className }: Props) => {
  const [isVisible, setVisible] = useState(true);
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.stopPropagation();
      setVisible((isVisible) => !isVisible);
    },
    []
  );
  return (
    <button
      className={cn(
        'ml-auto mr-1 inline-flex h-fit w-fit items-center justify-center rounded-full px-1 text-white  transition-all duration-300 hover:opacity-50',
        className
      )}
      onClick={handleClick}
    >
      <span
        data-visibility={isVisible ? 'on' : 'off'}
        className="aspect-square text-lg transition-all data-[visibility=off]:icon-[mdi--eye-off] data-[visibility=on]:icon-[mdi--eye] data-[visibility=off]:opacity-50"
      />
    </button>
  );
};
