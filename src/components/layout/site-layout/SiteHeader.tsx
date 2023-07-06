import Link from 'next/link';
import NavBtn from './Navigation/NavBtn';
import Image from 'next/image';
import { Icon } from '@mdi/react';
import { mdiMenuUp, mdiMenuDown, mdiChevronUp, mdiChevronDown } from '@mdi/js';
import { useCallback, useRef, useState, MouseEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';
import { cn } from '~/lib/utils/cn';
import { SystemsDropdownMenu } from './Navigation/dropdown/SystemsDropdownMenu';
import NavMenu from './Navigation/nav-menu/NavMenu';

const SiteHeader = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const headerRef = useRef<HTMLElement>(null!);

  const handleClick = useCallback(() => {
    headerRef.current.setAttribute(
      'data-state',
      isOpen ? 'closed' : 'reopened'
    );

    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <>
      <header
        ref={headerRef}
        data-state="open"
        className={cn(
          `sticky top-0 z-[99999999] flex h-20 w-screen min-w-full translate-y-[0%] flex-row items-center justify-start border-b-2 border-border bg-background py-0 pl-6 pr-36 text-foreground transition-transform duration-300 ease-in`,
          `data-[state=closed]:-translate-y-[100%]`
        )}
      >
        <div className="flex-start my-2 mr-auto flex flex-row items-center">
          <Link
            className="flex h-full w-full items-center justify-center"
            href="/"
          >
            <div className="aspect-square w-10 ">
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
            <h2
              className={`mx-4 text-center font-display text-3xl font-extrabold tracking-tight`}
            >
              Astronomia <span className="text-spaceCadet-300">Nova</span>
            </h2>
          </Link>
        </div>

        <NavMenu />

        {/* visibility toggle */}
        <button
          className="absolute left-[50%] top-full flex h-4 w-10 -translate-x-1/2 flex-row items-center justify-center rounded-b-xl  bg-gray-200 bg-opacity-40 p-0"
          onClick={handleClick}
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

export default SiteHeader;
