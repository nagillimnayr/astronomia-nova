import Link from 'next/link';
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu';

type NavMenuLinkProps = {
  children?: React.ReactNode;
  href: string;
};
const NavMenuLink = ({ children, href }: NavMenuLinkProps) => {
  return (
    <Link href={href} legacyBehavior passHref>
      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
        {children}
      </NavigationMenuLink>
    </Link>
  );
};

export default NavMenuLink;
