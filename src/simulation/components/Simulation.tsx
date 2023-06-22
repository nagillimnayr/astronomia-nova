import React from 'react';
import SolarSystem from './SolarSystem/SolarSystem';
import { useFrame, useThree } from '@react-three/fiber';

import { simState } from '../state/SimState';
import { useEventListener } from 'usehooks-ts';
//import { type CameraControls as CameraController } from 'three-stdlib';
import { timeState } from '../state/TimeState';
import { camState } from '../state/CamState';
import { keplerTreeState } from '../state/keplerTreeState';
import { Leva, useControls } from 'leva';
import { DebugPanel } from './leva/DebugPanel';
import EarthMars from './SolarSystem/EarthMars';
import { retrogradeState } from './Retrograde/retrogradeState';
import { selectState } from '../state/SelectState';
import { SelectionPanel } from './leva/SelectionPanel';

//type SimProps = {};
const Simulation = () => {
  console.log('render Simulation');
  // function for accessing scene state
  const getState = useThree((state) => state.get);
  simState.getState = getState;

  useFrame(({ clock }, delta) => {
    // update camera
    if (!timeState.isPaused) {
      // scale delta time
      const scaledDelta = delta * timeState.timescale;
      timeState.updateClock(scaledDelta);

      // update simulation
      keplerTreeState.fixedUpdate(scaledDelta);

      retrogradeState.update();
    }
    camState.updateControls();
  });

  useEventListener('keypress', (e) => {
    e.preventDefault();
    console.log('keydown: ', e.key);
    if (e.key === ' ') {
      console.log('selected: ', selectState.selected);
      console.log('focusTarget: ', camState.focusTarget);
    }
  });

  return (
    <>
      <group>
        {/* <polarGridHelper args={[24, 16, 24, 64]} /> */}
        <SolarSystem />
        {/* <EarthMars /> */}
      </group>
      <DebugPanel />
      <SelectionPanel />
      <ambientLight intensity={0.2} />
    </>
  );
};

export default Simulation;
