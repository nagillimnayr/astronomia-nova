import Link from 'next/link';
import NavBtn from './NavBtn';

const NavBar = () => {
  return (
    <header className="navbar sticky top-0 flex min-w-full flex-row items-stretch justify-start border-2 border-white py-0 pl-6 pr-36">
      <div className="flex-start mr-auto flex flex-row">
        <div className="aspect-square w-24 border-2 border-white"></div>
        <h2 className="mx-6 text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Placeholder <span className="text-[hsl(280,100%,70%)]">Title</span>
        </h2>
      </div>

      <NavBtn href="about">About</NavBtn>
      <NavBtn href="markdown">MDX</NavBtn>
      <NavBtn href="timeline">Timeline</NavBtn>
      <NavBtn href="other">Other</NavBtn>
    </header>
  );
};

export default NavBar;
