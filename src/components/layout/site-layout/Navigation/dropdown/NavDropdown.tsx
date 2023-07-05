import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  MenuIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  MenuSquareIcon,
  PanelTopCloseIcon,
  PanelTopOpenIcon,
} from 'lucide-react';

const NavDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuLabel></DropdownMenuLabel> */}
        <DropdownMenuItem></DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavDropdown;
