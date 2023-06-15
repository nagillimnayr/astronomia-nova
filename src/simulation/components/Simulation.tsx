import React, { MutableRefObject, useContext, useRef } from 'react';
import SolarSystem, { UpdateFn } from './SolarSystem/SolarSystem';
import { useFrame, useThree } from '@react-three/fiber';
import { TimeContext, TimeContextObject } from '../context/TimeContext';
import TimePanel from './Time/TimePanel';
import { format, addSeconds, formatDistance } from 'date-fns';
import { DAY } from '../utils/constants';
import { HUD } from './HUD/HUD';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

//type SimProps = {};
const Simulation = () => {
  // function for accessing scene state
  const getState = useThree((state) => state.get);

  // set clock to be stopped initially
  getState().clock.stop();

  // reference to update function that will be passed back up by the SolarSystem component
  const updateRef = useRef<UpdateFn>(null!);

  // create time context object
  const time: TimeContextObject = {
    timerRef: useRef<HTMLSpanElement>(null!),
    hourRef: useRef<HTMLParagraphElement>(null!),
    dateRef: useRef<HTMLParagraphElement>(null!),
    timescaleDisplayRef: useRef<HTMLSpanElement>(null!),
    timeElapsedRef: useRef<number>(0),
    timescaleRef: useRef<number>(1),
  };

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
    <TimeContext.Provider value={time}>
      <group>
        {/* <polarGridHelper args={[24, 16, 24, 64]} /> */}
        <SolarSystem ref={updateRef} />

        <OrbitControls makeDefault minDistance={10}>
          <HUD />
        </OrbitControls>
      </group>
      <ambientLight intensity={0.1} />
    </TimeContext.Provider>
  );
};

export default Simulation;
