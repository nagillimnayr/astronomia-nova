'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { type ClassNameValue } from 'tailwind-merge';

type Props = {
  className?: ClassNameValue;
};
const SiteHeader = ({ className }: Props) => {
  const headerRef = useRef<HTMLElement>(null!);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          `relative z-40 flex h-full w-full min-w-full translate-y-[0%] flex-row items-center justify-start border-b bg-muted py-4 pl-6 pr-36 text-muted-foreground transition-transform duration-300 ease-in`,
          `data-[state=closed]:-translate-y-[100%]`,
          className
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
              Astronomia{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Nova
              </span>
            </h2>
          </Link>
        </div>
      </header>
    </>
  );
};

export default SiteHeader;
