import Link from 'next/link';

type NavBtnProps = {
  children: React.ReactNode;
  href: string;
};
const NavBtn = (props: NavBtnProps) => {
  return (
    <button className="mx-0 my-0  px-4 font-orbitron hover:bg-neutral-300/10">
      <Link
        className="flex h-full w-full items-center justify-center"
        href={props.href}
      >
        <h3 className="text-xl ">{props.children}</h3>
      </Link>
    </button>
  );
};

export default NavBtn;
