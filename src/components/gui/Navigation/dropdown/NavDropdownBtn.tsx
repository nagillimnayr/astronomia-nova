import Link from 'next/link';

type NavDropdownBtnProps = {
  children: React.ReactNode;
  href: string;
};
const NavDropdownBtn = (props: NavDropdownBtnProps) => {
  return (
    <div className="mx-0 my-0 rounded-md bg-white px-4  text-black hover:bg-neutral-200">
      <Link
        className="flex h-fit w-full items-center justify-start font-display"
        href={props.href}
      >
        <h3 className="text-lg ">{props.children}</h3>
      </Link>
    </div>
  );
};

export default NavDropdownBtn;
