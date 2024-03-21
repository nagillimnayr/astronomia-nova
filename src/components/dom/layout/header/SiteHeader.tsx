'use client';
import { cn } from '@/helpers/cn';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef } from 'react';
import { type ClassNameValue } from 'tailwind-merge';
import { useSpring, animated } from '@react-spring/web';

type SiteHeaderProps = {
  className?: ClassNameValue;
};
export const SiteHeader = ({ className }: SiteHeaderProps) => {
  const headerRef = useRef<HTMLElement>(null!);

  const [spring, springRef] = useSpring(() => ({
    color: 'white',
  }));

  const handlePointerEnter = useCallback(() => {
    springRef.start({ color: 'transparent' });
  }, [springRef]);
  const handlePointerLeave = useCallback(() => {
    springRef.start({ color: 'white' });
  }, [springRef]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          `relative z-40 hidden h-full w-full min-w-full translate-y-[0%]
           flex-row items-center justify-start border-b border-border bg-muted py-4 
           pl-6 text-muted-foreground sm:flex md:pr-12 lg:pr-36`,
          className
        )}
      >
        {/** Title. */}
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
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
          >
            <h2
              className={`mx-4 bg-gradient-to-r text-center font-display text-3xl font-extrabold tracking-tight`}
            >
              <animated.span
                style={spring}
                className={
                  ' bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text'
                }
              >
                Astronomia{' '}
              </animated.span>
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Nova
              </span>
            </h2>
          </Link>
        </div>

        {/** Documentation Link. */}
        <div className="ml-auto mr-5 flex items-center justify-center transition-colors hover:text-indigo-400">
          <Link
            href={'/user-guide'}
            className="hidden items-center justify-between gap-1 text-xl md:flex"
          >
            <span className="font-sans">User Guide</span>
            <span className="icon-[mdi--help-circle-outline] aspect-square h-6 w-6" />
          </Link>
        </div>
      </header>
    </>
  );
};
