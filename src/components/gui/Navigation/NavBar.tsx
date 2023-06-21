import Link from 'next/link';
import NavBtn from './NavBtn';
import Image from 'next/image';
import { Icon } from '@mdi/react';
import { mdiMenuUp, mdiMenuDown, mdiChevronUp, mdiChevronDown } from '@mdi/js';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { cn } from '~/simulation/utils/cn';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <>
      <header
        className={cn(
          `sticky top-0 z-[99999999] flex h-28 w-screen min-w-full flex-row items-stretch justify-start bg-secondary py-0 pl-6 pr-36 text-white`,
          {
            'top-0 -translate-y-[100%] transition-transform duration-300 ease-out':
              !isOpen,
          }
        )}
      >
        <div className="flex-start my-2 mr-auto flex flex-row items-center">
          <Link
            className="flex h-full w-full items-center justify-center"
            href="/"
          >
            <div className="aspect-square w-16 ">
              <Image
                src="/logo/Douglas_College_logo_inverted.svg"
                alt=""
                width={128.19989}
                height={134.69519}
              />
            </div>
          </Link>
          <Link
            className="flex h-full w-full items-center justify-center whitespace-nowrap"
            href="/"
          >
            <h3
              className={`mx-6  text-center font-display text-5xl font-extrabold tracking-tight`}
            >
              Astronomia <span className="text-spaceCadet-300">Nova</span>
            </h3>
          </Link>
        </div>
        <NavBtn href="about">About</NavBtn>
        <NavBtn href="equations">Equations</NavBtn>
        <NavBtn href="markdown">MDX</NavBtn>
        <NavBtn href="timeline">Timeline</NavBtn>
        <NavBtn href="other">Other</NavBtn>

        {/* visibility toggle */}
        <button
          className="absolute left-[50%] top-full flex h-6 w-10 -translate-x-1/2 flex-row items-center justify-center rounded-b-xl  bg-gray-200 bg-opacity-40 p-0"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <Icon
            className="-translate-y-0.5"
            path={isOpen ? mdiMenuUp : mdiMenuDown}
            size={2}
          />
        </button>
      </header>
    </>
  );
};

export default NavBar;
