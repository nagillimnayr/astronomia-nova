import Link from 'next/link';
import NavBtn from './NavBtn';
import Image from 'next/image';

import { Orbitron } from 'next/font/google';
const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

const NavBar = () => {
  return (
    <header className="navbar sticky top-0 z-50 flex h-28 w-screen min-w-full flex-row items-stretch justify-start bg-gray-800 py-0 pl-6 pr-36 text-neutral-100">
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
            className={`${orbitron.variable} mx-6  text-center font-display  text-5xl font-extrabold tracking-tight`}
          >
            Astronomia <span className="text-spaceCadet-400">Nova</span>
          </h3>
        </Link>
      </div>

      <NavBtn href="about">About</NavBtn>
      <NavBtn href="markdown">MDX</NavBtn>
      <NavBtn href="timeline">Timeline</NavBtn>
      <NavBtn href="other">Other</NavBtn>
    </header>
  );
};

export default NavBar;
