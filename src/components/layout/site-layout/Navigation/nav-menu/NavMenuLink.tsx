import { cn } from '@/lib/cn';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PropsWithChildren } from 'react';
import { ClassNameValue } from 'tailwind-merge';

type Props = PropsWithChildren & {
  className: ClassNameValue;
  href: URL | string;
};
const NavMenuLink = ({ children, className, href }: Props) => {
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
