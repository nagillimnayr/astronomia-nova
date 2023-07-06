import { Menu } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';
import { cn } from '~/lib/utils/cn';
import { ChevronDownIcon } from 'lucide-react';
import { Props } from '~/components/props/Props';

type link = {
  href: string;
  label: string;
};

type DropdownProps = Props & {
  links: link[];
};
const NavDropdownMenu = ({ children, className, links }: DropdownProps) => {
  return (
    <Menu as="div" className={'relative ml-auto flex flex-col'}>
      <div className="relative">
        <Menu.Button
          className={cn('rounded-md border-2 p-2 font-sans', className)}
        >
          {({ open }) => {
            // render prop to switch chevron direction
            return (
              <div className="inline-flex items-center justify-start gap-3">
                {children}{' '}
                <ChevronDownIcon
                  data-open={open ? 'open' : 'closed'}
                  className={cn('transition-transform ui-open:-rotate-180')}
                />
              </div>
            );
          }}
        </Menu.Button>
        <Menu.Items
          className={
            'dropdown-center flex w-fit min-w-fit  flex-col justify-start whitespace-nowrap rounded-md border-2'
          }
        >
          {links.map(({ href, label }) => {
            return (
              /* Use the `active` state to conditionally style the active item.*/
              <Menu.Item key={href} as={Fragment}>
                <Link
                  href={href}
                  className={
                    'bg-background px-2 font-sans text-foreground ui-active:bg-indigo-400 ui-active:text-white'
                  }
                >
                  {label}
                </Link>
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </div>
    </Menu>
  );
};

export default NavDropdownMenu;
