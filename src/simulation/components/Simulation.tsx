import React, { MutableRefObject, useContext, useRef } from 'react';
import SolarSystem, { UpdateFn } from './SolarSystem/SolarSystem';
import { useFrame, useThree } from '@react-three/fiber';
import { TimeContext, TimeContextObject } from '../context/TimeContext';
import TimePanel from './Time/TimePanel';
import { format, addSeconds, formatDistance } from 'date-fns';
import { DAY } from '../utils/constants';
import { HUD } from './HUD/HUD';
import { useState } from 'react';
import {
  PerspectiveCamera,
  OrbitControls,
  CameraControls,
} from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { simState } from '../state/SimState';
import { useEventListener, useTimeout } from 'usehooks-ts';
import { type OrbitControls as OrbitController } from 'three-stdlib';
import { timeState } from '../state/TimeState';

//type SimProps = {};
const Simulation = () => {
  // function for accessing scene state
  const getState = useThree((state) => state.get);
  simState.getState = getState;

  // set clock to be stopped initially
  getState().clock.stop();

  // reference to update function that will be passed back up by the SolarSystem component
  const updateRef = useRef<UpdateFn>(null!);

  // orbit ref
  const orbitRef = useRef<OrbitController>(null!);

  useFrame(({ clock }, delta) => {
    if (!clock.running) {
      return;
    }
    // scale delta time
    const scaledDelta = delta * timeState.timescale;
    timeState.updateClock(scaledDelta);

    const fixedUpdate = updateRef.current;
    fixedUpdate(scaledDelta);
  });

  useEventListener('keypress', (e) => {
    e.preventDefault();
    console.log('keydown: ', e.key);
    if (e.key === ' ') {
      console.log('selected: ', simState.selected);
    }
  });

  return (
    <>
      <group>
        {/* <polarGridHelper args={[24, 16, 24, 64]} /> */}
        <SolarSystem ref={updateRef} />
      </group>
      <PerspectiveCamera makeDefault position={[0, 0, 20]}>
        <HUD />
      </PerspectiveCamera>

      <OrbitControls
        ref={(controls) => {
          if (!controls) {
            return;
          }
          orbitRef.current = controls;
          simState.controls = controls;
        }}
        makeDefault
        minDistance={10}
        enablePan={false}
      />

      <ambientLight intensity={0.1} />
    </>
  );
};

export default Simulation;
