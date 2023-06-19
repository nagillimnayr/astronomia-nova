import Link from 'next/link';

type NavBtnProps = {
  children: React.ReactNode;
  href: string;
};
const NavBtn = (props: NavBtnProps) => {
  return (
    <button className="mx-0 my-0  px-4 hover:bg-neutral-300 hover:bg-opacity-20">
      <Link href={props.href}>
        <h3 className="text-3xl ">{props.children}</h3>
      </Link>
    </button>
  );
};

export default NavBtn;
