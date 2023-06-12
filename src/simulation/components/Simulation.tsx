import React, { MutableRefObject, useContext, useRef } from 'react';
import SolarSystem from './SolarSystem/SolarSystem';
import { useFrame } from '@react-three/fiber';
import { round } from 'mathjs';
import { Html } from '~/drei-imports/abstractions/text/Html';
import TimeDisplay from './Time/TimeDisplay';
import TimerContext from '../context/TimerContext';
import { Hud } from '~/drei-imports/portals/Hud';
import { ScreenSpace } from '~/drei-imports/abstractions/ScreenSpace';

//type SimProps = {};
const Simulation = () => {
  const { timerRef } = useContext(TimerContext);
  useFrame(({ clock }) => {
    timerRef.current.textContent = round(clock.elapsedTime).toString();
  });
  return (
    <>
      <group>
        <polarGridHelper args={[24, 16, 24, 64]} />
        <SolarSystem />
      </group>
    </>
  );
};

export default Simulation;
