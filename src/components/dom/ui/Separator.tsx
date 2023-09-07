import { cn } from '@/helpers/cn';
import * as RadixSeparator from '@radix-ui/react-separator';
import { type ClassNameValue } from 'tailwind-merge';

type Props = {
  orientation?: 'horizontal' | 'vertical';
  className?: ClassNameValue;
};

export function Separator({ orientation = 'horizontal', className }: Props) {
  return (
    <RadixSeparator.Root
      orientation={orientation}
      decorative
      className={cn('h-px w-full border bg-border', className)}
    />
  );
}
