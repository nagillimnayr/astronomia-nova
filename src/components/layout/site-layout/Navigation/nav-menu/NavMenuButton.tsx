import { Menu } from '@headlessui/react';
import { cn } from '~/lib/cn';

type Props = {
  children?: React.ReactNode;
  className?: string;
};
const NavMenuButton = ({ children, className }: Props) => {
  return (
    <Menu.Button className={cn('rounded-md border-2 p-2 font-sans', className)}>
      {children}
    </Menu.Button>
  );
};

export default NavMenuButton;
