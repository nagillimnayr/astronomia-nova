import { cn } from '~/lib/cn';
import { atomicAge, orbitron, roboto } from '../../../lib/fonts';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

const fontVariables = [atomicAge.variable, orbitron.variable, roboto.variable];

type SiteLayoutProps = {
  children: React.ReactNode;
};
const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <div
      className={cn(
        ...fontVariables,
        `min-w-screen relative m-0 flex h-fit min-h-screen w-screen flex-col items-center justify-start bg-background p-0 font-sans text-foreground`
      )}
    >
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
