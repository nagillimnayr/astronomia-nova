import { cn } from '@/lib/cn';
import styles from './fallback.module.css';
import { ClassNameValue } from 'tailwind-merge';

type FallbackProps = {
  primary?: boolean;
  className?: ClassNameValue;
};
export const LoadingFallback = ({
  primary = false,
  className,
}: FallbackProps) => {
  return primary ? (
    <div
      className={cn('grid h-full w-full place-items-center text-foreground')}
    >
      <div className={cn('aspect-square w-12 rounded-full ', className)}>
        <span>Loading</span>
      </div>
    </div>
  ) : (
    <>
      <div
        className={cn(
          'relative flex aspect-square w-12 animate-spin items-center justify-center rounded-full border-b-2 border-l-2 border-gray-100 bg-transparent',
          // 'animate-spin',
          className
        )}
      >
        <div className="absolute top-0 aspect-square w-3 -translate-y-1/2 rounded-full bg-white" />
      </div>
    </>
  );
};
