import { cn } from '@/lib/cn';
import * as RadixSeparator from '@radix-ui/react-separator';

type Props = {
  orientation?: 'horizontal' | 'vertical';
  className: string;
};
export function Separator({ orientation = 'horizontal', className }: Props) {
  return (
    <RadixSeparator.Root
      orientation={orientation}
      decorative
      className={cn('h-px w-full', className)}
    />
  );
}
