import { cn } from '@/lib/cn';
import type { LinkProps } from '@/components/props/Props';
import Link from 'next/link';

const NavMenuLink = ({ children, className, href }: LinkProps) => {
  return (
    <button
      className={cn(
        'hover:bg-subtle ui-open:bg-subtle/50 bg-transparent transition-colors ',
        className
      )}
    >
      <Link href={href} className={cn('h-full w-full')}>
        {children}
      </Link>
    </button>
  );
};

export default NavMenuLink;
