import { cn } from '@/helpers/cn';
import { type HTMLProps } from 'react';

export const ArrowLeft = ({
  className,
  ...props
}: HTMLProps<HTMLSpanElement>) => {
  return (
    <span {...props} className={cn(className, 'icon-[mdi--arrow-left-thin]')} />
  );
};
export const ArrowRight = ({
  className,
  ...props
}: HTMLProps<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn(className, 'icon-[mdi--arrow-right-thin]')}
    />
  );
};
export const ArrowUp = ({
  className,
  ...props
}: HTMLProps<HTMLSpanElement>) => {
  return (
    <span {...props} className={cn(className, 'icon-[mdi--arrow-up-thin]')} />
  );
};
export const ArrowDown = ({
  className,
  ...props
}: HTMLProps<HTMLSpanElement>) => {
  return (
    <span {...props} className={cn(className, 'icon-[mdi--arrow-down-thin]')} />
  );
};
