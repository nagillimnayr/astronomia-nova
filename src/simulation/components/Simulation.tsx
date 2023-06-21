import React from 'react';
import SolarSystem from './SolarSystem/SolarSystem';
import { useFrame, useThree } from '@react-three/fiber';

import { simState } from '../state/SimState';
import { useEventListener } from 'usehooks-ts';
//import { type CameraControls as CameraController } from 'three-stdlib';
import { timeState } from '../state/TimeState';
import { camState } from '../state/CamState';
import { keplerTreeState } from '../state/keplerTreeState';
import { useControls } from 'leva';

//type SimProps = {};
const Simulation = () => {
  console.log('render Simulation');
  // function for accessing scene state
  const getState = useThree((state) => state.get);
  simState.getState = getState;

  // leva controls
  const debug = useControls({
    foo: false,
  });

  useFrame(({ clock }, delta) => {
    // update camera
    camState.updateControls();
    if (timeState.isPaused) {
      return;
    }
    // scale delta time
    const scaledDelta = delta * timeState.timescale;
    timeState.updateClock(scaledDelta);

    // update simulation
    keplerTreeState.fixedUpdate(scaledDelta);
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
        <SolarSystem />
      </group>
      {debug.foo ? <ambientLight intensity={0.1} /> : null}
    </>
  );
};

export default Simulation;
