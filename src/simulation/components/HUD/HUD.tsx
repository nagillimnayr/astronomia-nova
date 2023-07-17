import TimePanel from '../Time/TimePanel';
import { DetailsPanel } from './DetailsPanel/DetailsPanel';
import DouglasLogo from './DouglasLogo';

export const HUD = () => {
  return (
    <>
      <div className="pointer-events-none absolute z-[9999] h-full min-h-full w-full min-w-full ">
        <DetailsPanel />
        <TimePanel />

        <DouglasLogo />
      </div>
    </>
  );
};
