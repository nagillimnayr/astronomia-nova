import { RootState, useFrame, useThree } from '@react-three/fiber';
import DateDisplay from './DateDisplay';
import TimeControls from './TimeControls';
import TimeDisplay from './TimeDisplay';
import TimescaleDisplay from './TimescaleDisplay';
import { Html } from '~/drei-imports/abstractions/text/Html';
import { useContext, useRef } from 'react';
import {
  TimeContext,
  TimeContextObject,
} from '~/simulation/context/TimeContext';
import { Camera, Object3D } from 'three';

//type TimePanelProps = {};
const TimePanel = () => {
  const htmlRef = useRef<HTMLDivElement>(null!);

  return (
    <Html
      ref={htmlRef}
      fullscreen
      className="flex min-h-fit  min-w-fit flex-col items-center justify-end whitespace-nowrap border-2 border-red-500"
    >
      <div className="w-min-fit h-min-fit flex h-fit w-64 select-none flex-col items-center justify-start self-center border-2 border-blue-500">
        <TimeDisplay />
        <TimescaleDisplay />
        <DateDisplay />
        <TimeControls />
      </div>
    </Html>
  );
};

export default TimePanel;
