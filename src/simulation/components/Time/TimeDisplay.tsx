import { MutableRefObject, forwardRef, useContext } from 'react';
import { Html } from '~/drei-imports/abstractions/text/Html';
import TimerContext from '../../context/TimerContext';
import { useFrame } from '@react-three/fiber';
import { round } from 'mathjs';

// type TimeProps = {
//   timerRef: MutableRefObject<HTMLSpanElement>;
//   portalRef: MutableRefObject<HTMLDivElement>;
// };
const TimeDisplay = forwardRef<HTMLSpanElement>(function TimeDisplay() {
  const { timerRef } = useContext(TimerContext);

  return (
    <div className="w-min-fit h-min-fit  flex h-fit w-fit flex-row self-center border-2 border-blue-500 px-2 text-center text-white">
      {/* Days Elapsed */}
      <div>
        <span className="w-min-fit flex flex-row whitespace-nowrap ">
          Days Elapsed: &nbsp;
          <span ref={timerRef} className="text-green-300">
            0
          </span>
        </span>
      </div>
    </div>
  );
});

export default TimeDisplay;
