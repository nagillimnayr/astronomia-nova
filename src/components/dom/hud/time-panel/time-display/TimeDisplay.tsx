import { MachineContext } from '@/state/xstate/MachineProviders';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { TimeOfDayDisplay } from './TimeOfDayDisplay';
import { DateDisplay } from './DateDisplay';

export const TimeDisplay = () => {
  return (
    <div className="pointer-events-auto flex w-3/5 select-none flex-col items-center  text-white">
      <TimeOfDayDisplay />
      <DateDisplay />
    </div>
  );
};
