import { RootState, useFrame } from '@react-three/fiber';
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
import { GetState } from 'zustand';

type TimePanelProps = {
  time: TimeContextObject;
  getState: GetState<RootState>;
};
const TimePanel = (props: TimePanelProps) => {
  //const time = useContext(TimeContext);

  const getClock = () => {
    return props.getState().clock;
  };

  return (
    <TimeContext.Provider value={props.time}>
      <div className="w-min-fit h-min-fit  flex h-fit w-fit flex-col self-center border-2 border-blue-500">
        <TimeDisplay />
        <TimescaleDisplay />
        <DateDisplay />
        <TimeControls getClock={getClock} />
      </div>
    </TimeContext.Provider>
  );
};

export default TimePanel;
