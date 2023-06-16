import { MutableRefObject, forwardRef, useContext } from 'react';
import { Html } from '~/drei-imports/abstractions/text/Html';
import { TimeContext } from '../../context/TimeContext';
import { useFrame } from '@react-three/fiber';
import { round } from 'mathjs';
import { timeState } from '~/simulation/state/TimeState';
import { formatDistance } from 'date-fns';
import { useSnapshot } from 'valtio';

const TimeDisplay = () => {
  const snap = useSnapshot(timeState);
  return (
    <div className="w-min-fit h-min-fit  flex h-fit w-fit flex-row self-center border-2 border-blue-500 px-2 text-center text-white">
      {/* Days Elapsed */}
      <div>
        <p className="w-min-fit flex flex-row whitespace-nowrap ">
          Time Elapsed: &nbsp;
          <span className="text-green-300">
            {formatDistance(snap.date, snap.refDate)}
          </span>
        </p>
      </div>
      <div></div>
    </div>
  );
};

export default TimeDisplay;
