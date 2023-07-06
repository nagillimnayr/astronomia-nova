import { Menu } from '@headlessui/react';
import type { ClassNameProp } from '~/components/props/Props';
import { LucideIcon, SettingsIcon } from 'lucide-react';
import { cn } from '~/lib/cn';

type DropdownMenuProps = ClassNameProp & {
  renderIcon: () => JSX.Element; // render prop for icon
    renderListItem: () => JSX.Element; // render prop for list items
  menuItems: 
};
const DropdownMenu = ({ className }: ClassNameProp) => {
  return (
    <Menu as="div" className={'relative ml-auto flex flex-col'}>
      <div className="relative">
        <Menu.Button className={cn(className)}>
          {({ open }) => {
            // render prop to switch chevron direction
            return (
              <div className="inline-flex items-center justify-start gap-3">
                <SettingsIcon
                  data-open={open ? 'open' : 'closed'}
                  className={'ui-open:-rotate-360 transition-transform'}
                />
              </div>
            );
          }}
        </Menu.Button>
        <Menu.Items
          className={
            'dropdown-center flex w-fit min-w-fit  flex-col justify-start whitespace-nowrap rounded-md border-2 bg-popover text-popover-foreground'
          }
        >
          {links.map(({ href, label }) => {
            return (
              /* Use the `active` state to conditionally style the active item.*/
              <Menu.Item key={href} as={Fragment}>
                <Link
                  href={href}
                  className={
                    'min-w-full rounded-md bg-transparent px-2 py-1 font-sans  ui-active:bg-indigo-400 ui-active:text-white'
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
