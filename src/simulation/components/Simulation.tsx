import React, { MutableRefObject, useContext, useRef } from 'react';
import SolarSystem from './SolarSystem/SolarSystem';
import { useFrame } from '@react-three/fiber';
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
} from 'date-fns';
import { DAY } from '../utils/constants';

//type SimProps = {};
const Simulation = () => {
  const timeContext = useContext(TimeContext);
  const j2000 = new Date(2000, 0, 1, 12, 0, 0, 0);
  useFrame(({ clock }) => {
    const elapsedDays = clock.elapsedTime;
    timeContext.timerRef.current.textContent = round(elapsedDays).toString();
    const currentDate = addSeconds(j2000, elapsedDays * DAY);

    timeContext.hourRef.current.textContent = format(currentDate, 'pp');
    timeContext.dateRef.current.textContent = format(currentDate, 'PPP');
  });
  return (
    <TimeContext.Provider value={timeContext}>
      <group>
        <polarGridHelper args={[24, 16, 24, 64]} />
        <SolarSystem />
      </group>
    </TimeContext.Provider>
  );
};

export default Simulation;
