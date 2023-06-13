import { MutableRefObject, forwardRef, useContext } from 'react';
import { Html } from '~/drei-imports/abstractions/text/Html';
import { TimeContext } from '../../context/TimeContext';
import { useFrame } from '@react-three/fiber';
import { round } from 'mathjs';

// type TimeProps = {
//   timerRef: MutableRefObject<HTMLSpanElement>;
//   portalRef: MutableRefObject<HTMLDivElement>;
// };
const TimeDisplay = forwardRef<HTMLSpanElement>(function TimeDisplay() {
  const { timerRef } = useContext(TimeContext);

  return (
    <div className="w-min-fit h-min-fit  flex h-fit w-fit flex-row self-center border-2 border-blue-500 px-2 text-center text-white">
      {/* Days Elapsed */}
      <div>
        <p className="w-min-fit flex flex-row whitespace-nowrap ">
          Days Elapsed: &nbsp;
          <span ref={timerRef} className="text-green-300">
            0
          </span>
        </p>
      </div>
      <div></div>
    </div>
  );
});

export default TimeDisplay;
