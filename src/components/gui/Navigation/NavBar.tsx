import Link from 'next/link';
import NavBtn from './NavBtn';
import Image from 'next/image';

const NavBar = () => {
  return (
    <header className="bg-gradient-neutral navbar sticky top-0 z-50 flex h-28 w-screen min-w-full flex-row items-stretch justify-start py-0 pl-6 pr-36 text-neutral-100">
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
          <h2 className="mx-6 text-center font-extrabold tracking-tight sm:text-[5rem]">
            Placeholder <span className="text-spaceCadet-400">Title</span>
          </h2>
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
