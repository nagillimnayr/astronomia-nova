import { cn } from '~/lib/utils/cn';
import NavDropdownMenu from './NavDropdownMenu';
import NavMenuLink from './NavMenuLink';

type link = {
  href: string;
  label: string;
};

const mainLinks = [
  { href: '/about', label: 'About' },
  { href: '/info', label: 'Info' },
  { href: '/equations', label: 'Equations' },
];

const systemLinks = [
  { href: '/systems/solar-system', label: 'Solar System' },
  { href: '/systems/earth-mars', label: 'Stellae Martis' },
  { href: '/systems/earth', label: 'Earth' },
  { href: '/systems/mars', label: 'Mars' },
];

const btnStyle = `rounded-md border-0 py-2 px-4 font-sans h-full hover:bg-foreground/10 ui-open:bg-foreground/10`;
const NavMenu = () => {
  return (
    <div
      className={
        'relative ml-auto flex h-fit w-fit flex-row items-center justify-start gap-0 rounded-md border-2 p-1'
      }
    >
      {mainLinks.map(({ href, label }) => {
        return (
          <NavMenuLink key="href" href={href} className={btnStyle}>
            {label}
          </NavMenuLink>
        );
      })}
      <NavDropdownMenu links={systemLinks} className={btnStyle}>
        <div className="inline-flex gap-3">Systems </div>
      </NavDropdownMenu>
    </div>
  );
};

export default NavMenu;
