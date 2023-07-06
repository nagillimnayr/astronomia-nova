import { Menu } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';
import { cn } from '~/lib/utils/cn';
import NavDropdownMenu from './NavDropdownMenu';

type link = {
  href: string;
  label: string;
};
const systemLinks = [
  { href: '/systems/solar-system', label: 'Solar System' },
  { href: '/systems/earth-mars', label: 'Stellae Martis' },
  { href: '/systems/earth', label: 'Earth' },
  { href: '/systems/mars', label: 'Mars' },
];

const NavMenu = () => {
  return (
    <Menu as="div" className={'relative ml-auto flex flex-row'}>
      <NavDropdownMenu links={systemLinks}>
        <div className="inline-flex gap-3">Systems</div>
      </NavDropdownMenu>
    </Menu>
  );
};

export default NavMenu;
