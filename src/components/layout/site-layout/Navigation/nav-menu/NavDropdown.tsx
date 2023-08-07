import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { type PropsWithChildren, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { type ClassNameValue } from 'tailwind-merge';

type link = {
  href: string;
  label: string;
};

type Props = PropsWithChildren & {
  links: link[];
  className?: ClassNameValue;
};
const NavDropdown = ({ children, className, links }: Props) => {
  const containerRef = useRef<HTMLElement | null>(null);
  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        ref={(button) => {
          if (!button) return;
          const parent = button.parentElement;
          containerRef.current = parent;
        }}
        asChild
        className="pointer-events-auto h-fit w-full hover:bg-subtle "
      >
        <button
          className={cn(
            'pointer-events-auto w-full transition-colors hover:bg-subtle',
            className
          )}
        >
          <span className="inline-flex items-center justify-start gap-3">
            {children}{' '}
            <span
              className={
                'icon-[mdi--chevron-down] transition-transform data-[state=open]:-rotate-180'
              }
            />
          </span>
        </button>
      </Dropdown.Trigger>

      <Dropdown.Portal container={containerRef.current}>
        <Dropdown.Content
          loop
          className={
            'dropdown-center z-50 flex h-fit w-fit min-w-fit origin-top flex-col items-stretch justify-start overflow-y-hidden whitespace-nowrap rounded-md border-2 bg-popover p-1 font-sans text-popover-foreground data-[state=closed]:animate-scale-up data-[state=open]:animate-scale-down'
          }
        >
          {links.map(({ href, label }) => {
            return (
              <Dropdown.Item
                key={href}
                className="inline-flex h-fit w-full justify-stretch"
              >
                <Link
                  href={href}
                  className={
                    'w-full min-w-full rounded-md bg-transparent px-2 py-1 font-sans hover:bg-subtle hover:text-subtle-foreground'
                  }
                >
                  <span className="font-sans">{label}</span>
                </Link>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
};

export { NavDropdown };
