import { Menu } from '@headlessui/react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { Fragment } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ChevronDownIcon } from 'lucide-react';
import type { CommonProps } from '@/components/props/Props';

type link = {
  href: string;
  label: string;
};

type NavDropdownProps = CommonProps & {
  links: link[];
};
const NavDropdownMenu = ({ children, className, links }: NavDropdownProps) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger
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

      <Dropdown.Portal>
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
                  {label}
                </Link>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
};

export default NavDropdownMenu;
