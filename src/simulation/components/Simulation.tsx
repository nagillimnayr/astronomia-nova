import React, { MutableRefObject, useContext, useRef } from 'react';
import SolarSystem from './SolarSystem/SolarSystem';
import { useFrame, useThree } from '@react-three/fiber';
import { floor, round } from 'mathjs';
import { Html } from '~/drei-imports/abstractions/text/Html';
import TimeDisplay from './Time/TimeDisplay';
import { TimeContext } from '../context/TimeContext';
import { Hud } from '~/drei-imports/portals/Hud';
import { ScreenSpace } from '~/drei-imports/abstractions/ScreenSpace';
import TimePanel from './Time/TimePanel';
import {
  format,
  addDays,
  secondsToHours,
  addHours,
  addSeconds,
  formatDistance,
} from 'date-fns';
import { DAY } from '../utils/constants';

//type SimProps = {};
const Simulation = () => {
  // get TimeContextObject
  const time = useContext(TimeContext);

  const getState = useThree((state) => state.get);

  getState().clock.stop();

  // J2000 epoch reference date
  const j2000 = new Date(2000, 0, 1, 12, 0, 0, 0);

  useFrame(({ clock }, delta) => {
    if (!clock.running) {
      return;
    }
    // scale delta time
    const scaledDelta = delta * time.timescaleRef.current * DAY;
    // increase time elapsed by scaled delta time
    time.timeElapsedRef.current += scaledDelta;

    // get date relative to J2000 epoch
    const currentDate = addSeconds(j2000, time.timeElapsedRef.current);
    time.timerRef.current.textContent = formatDistance(currentDate, j2000);

    time.hourRef.current.textContent = format(currentDate, 'hh:mm:ss a');
    time.dateRef.current.textContent = format(currentDate, 'PPP');
  });
  return (
    <>
      <group>
        <polarGridHelper args={[24, 16, 24, 64]} />
        <SolarSystem />
      </group>
      <Html className="min-h-fit min-w-fit whitespace-nowrap">
        <TimePanel time={time} getState={getState} />
      </Html>
    </>
  );
};

export default Simulation;
