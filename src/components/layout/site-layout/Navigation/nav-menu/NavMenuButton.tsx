import { Menu } from '@headlessui/react';
import { cn } from '@/lib/cn';

type Props = {
  children?: React.ReactNode;
  className?: string;
};
const NavMenuButton = ({ children, className }: Props) => {
  return (
    <Menu.Button
      className={cn(
        'hover:bg-subtle/50 rounded-md border-2 bg-transparent p-2 font-sans transition-colors',
        className
      )}
    >
      {children}
    </Menu.Button>
  );
};

export default NavMenuButton;
