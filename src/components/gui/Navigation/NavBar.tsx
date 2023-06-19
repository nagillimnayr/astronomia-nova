import Link from 'next/link';
import NavBtn from './NavBtn';
import Image from 'next/image';

const NavBar = () => {
  return (
    <header className="navbar sticky top-0 z-50 flex w-screen min-w-full flex-row items-stretch justify-start border-2 border-white py-0 pl-6 pr-36">
      <div className="flex-start mr-auto flex flex-row items-center">
        <Link className="h-full w-full" href="/">
          <div className="aspect-square w-24 border-2 border-white">
            <Image
              src="/logo/Douglas_College_logo_inverted.svg"
              alt=""
              width={128.19989}
              height={134.69519}
            />
          </div>
        </Link>
        <Link className="whitespace-nowrap" href="/">
          <h2 className="mx-6 text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Placeholder <span className="text-[hsl(280,100%,70%)]">Title</span>
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
