import { cn } from '@/lib/cn';
import NavDropdownMenu from './NavDropdownMenu';
import NavMenuLink from './NavMenuLink';
import NavDropdown from './NavDropdown';

type link = {
  href: string;
  label: string;
};

const mainLinks = [
  { href: '/about', label: 'About' },
  { href: '/equations', label: 'Equations' },
];

const systemLinks = [
  { href: '/systems/solar-system', label: 'Solar System' },
  { href: '/systems/earth-mars', label: 'Stellae Martis' },
  { href: '/systems/earth', label: 'Earth' },
  { href: '/systems/mars', label: 'Mars' },
];

const btnStyle = `rounded-md border-0 py-2 px-4 font-sans h-full`;
const NavBar = () => {
  return (
    <nav
      className={
        'relative ml-auto flex h-fit w-fit flex-row items-center justify-start gap-0 rounded-md border-2 p-1'
      }
    >
      {mainLinks.map(({ href, label }) => {
        return (
          <NavMenuLink key={href} href={href} className={btnStyle}>
            {label}
          </NavMenuLink>
        );
      })}
      <NavDropdown links={systemLinks} className={btnStyle}>
        <div className="inline-flex gap-3">Systems</div>
      </NavDropdown>
    </nav>
  );
};

export default NavBar;
