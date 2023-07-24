import { cn } from '@/lib/cn';
import type { LinkProps } from '@/components/props/Props';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NavMenuLink = ({ children, className, href }: LinkProps) => {
  return (
    <Button
      variant={'outline'}
      asChild
      className={cn(
        'pointer-events-auto bg-muted transition-colors hover:bg-subtle',
        className
      )}
    >
      <Link href={href} className={cn('h-full w-full')}>
        {children}
      </Link>
    </Button>
  );
};

export default NavMenuLink;
