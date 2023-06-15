import React, { MutableRefObject, useContext, useRef } from 'react';
import SolarSystem, { UpdateFn } from './SolarSystem/SolarSystem';
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
import { HUD } from './HUD/HUD';

//type SimProps = {};
const Simulation = () => {
  // get TimeContextObject
  const time = useContext(TimeContext);

  const getState = useThree((state) => state.get);

  // set clock to be stopped initially
  getState().clock.stop();

  const updateRef = useRef<UpdateFn>(null!);

  // J2000 epoch reference date
  const j2000 = new Date(2000, 0, 1, 12, 0, 0, 0);

  const updateClock = (scaledDelta: number) => {
    // increase time elapsed by scaled delta time
    time.timeElapsedRef.current += scaledDelta;

    // get date relative to J2000 epoch
    const currentDate = addSeconds(j2000, time.timeElapsedRef.current);
    time.timerRef.current.textContent = formatDistance(currentDate, j2000);

    time.hourRef.current.textContent = format(currentDate, 'hh:mm:ss a');
    time.dateRef.current.textContent = format(currentDate, 'PPP');
  };
  useFrame(({ clock }, delta) => {
    if (!clock.running) {
      return;
    }
    // scale delta time
    const scaledDelta = delta * time.timescaleRef.current;
    updateClock(scaledDelta * DAY);

    const fixedUpdate = updateRef.current;
    fixedUpdate(scaledDelta);
  });
  return (
    <>
      <group>
        {/* <polarGridHelper args={[24, 16, 24, 64]} /> */}
        <SolarSystem ref={updateRef} />
      </group>

      <HUD />
    </>
  );
};

export default Simulation;
