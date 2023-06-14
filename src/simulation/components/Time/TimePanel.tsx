import { RootState, useFrame, useThree } from '@react-three/fiber';
import DateDisplay from './DateDisplay';
import TimeControls from './TimeControls';
import TimeDisplay from './TimeDisplay';
import TimescaleDisplay from './TimescaleDisplay';
import { Html } from '~/drei-imports/abstractions/text/Html';
import { useContext } from 'react';
import {
  TimeContext,
  TimeContextObject,
} from '~/simulation/context/TimeContext';

//type TimePanelProps = {};
const TimePanel = () => {
  // the Html wrapper will render its contents outside of the canvas
  // so we need to bridge the context
  const time = useContext(TimeContext);
  const getState = useThree((state) => state.get);
  const getClock = () => {
    return getState().clock;
  };

  return (
    <Html className="min-h-fit min-w-fit whitespace-nowrap">
      <TimeContext.Provider value={time}>
        <div className="w-min-fit h-min-fit flex h-fit w-64  flex-col self-center border-2 border-blue-500">
          <TimeDisplay />
          <TimescaleDisplay />
          <DateDisplay />
          <TimeControls getClock={getClock} />
        </div>
      </TimeContext.Provider>
    </Html>
  );
};

export default TimePanel;
