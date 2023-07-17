import { cn } from '@/lib/cn';
import TimePanel from '../Time/TimePanel';
import { DetailsPanel } from './DetailsPanel/DetailsPanel';
import DouglasLogo from './DouglasLogo';

type Props = {
  className: string;
};
export const HUD = ({ className }: Props) => {
  return (
    <>
      <div
        className={cn(
          'pointer-events-none absolute h-full min-h-full w-full min-w-full',
          className
        )}
      >
        <DetailsPanel />
        <TimePanel />

        <DouglasLogo />
      </div>
    </>
  );
};
