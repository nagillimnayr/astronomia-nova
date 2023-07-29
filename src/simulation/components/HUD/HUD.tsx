import { cn } from '@/lib/cn';
import TimePanel from '../Time/TimePanel';
import { DetailsPanel } from './DetailsPanel/DetailsPanel';
import DouglasLogo from './DouglasLogo';
import { CamViewPortal } from './CamView/CamViewPortal';

type Props = {
  className: string;
};
export const HUD = ({ className }: Props) => {
  return (
    <>
      <div
        className={cn(
          'pointer-events-none absolute z-[3] h-full min-h-full w-full min-w-full',
          className
        )}
      >
        <CamViewPortal />
        <DetailsPanel />
        <TimePanel />

        <DouglasLogo />
      </div>
    </>
  );
};
