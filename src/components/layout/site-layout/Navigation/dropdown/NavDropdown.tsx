import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import NavDropdownBtn from './NavDropdownBtn';

export const NavDropdown = () => {
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <div className="mx-0 my-0 flex h-full flex-col items-center justify-center px-4 text-center font-orbitron hover:bg-neutral-300/10">
            <h3 className="text-xl">Systems</h3>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="items-left flex min-w-[220px] flex-col justify-start rounded-md bg-white text-black">
            {/* <DropdownMenu.Label /> */}

            <NavDropdownBtn href="sim">Solar System</NavDropdownBtn>
            <NavDropdownBtn href="earthMars">Stellae Martis</NavDropdownBtn>
            <NavDropdownBtn href="earth">Earth</NavDropdownBtn>
            <NavDropdownBtn href="mars">Mars</NavDropdownBtn>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};
