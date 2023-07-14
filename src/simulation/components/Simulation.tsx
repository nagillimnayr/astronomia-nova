import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import { simState } from '../state/SimState';
import { timeState } from '../state/TimeState';
import { camState } from '../state/CamState';
import { keplerTreeState } from '../state/keplerTreeState';
import { Leva, useControls } from 'leva';
import { DebugPanel } from './leva/DebugPanel';
import { retrogradeState } from './Retrograde/retrogradeState';
import { selectState } from '../state/SelectState';
import { SelectionPanel } from './leva/SelectionPanel';
import { CameraPanel } from './leva/CameraPanel';
import { useKeyPressed } from '@react-hooks-library/core';
import { useTimeStore } from '../state/zustand/time-store';

type SimProps = {
  children: React.ReactNode;
};
const Simulation = ({ children }: SimProps) => {
  console.log('render Simulation');
  // function for accessing scene state
  const getThree = useThree((state) => state.get);
  simState.getState = getThree;

  useFrame(({ clock, camera }, delta) => {
    const timeStore = useTimeStore.getState();

    if (!timeStore.isPaused) {
      // scale delta time
      const scaledDelta = delta * timeStore.timescale;

      // update clock in external state
      timeStore.addTimeToClock(scaledDelta);

      simState.updateIteration += 1;

      // update simulation
      keplerTreeState.fixedUpdate(scaledDelta);

      retrogradeState.update();
    }

    // update camera
    camState.updateControls();
  });

  useKeyPressed(' ', (evt) => {
    evt.preventDefault();
    const { camera, controls } = getThree();

    // console.log('selected: ', selectState.selected);
    // console.log('focusTarget: ', camState.focusTarget);
    // console.log('proxy controls: ', camState.controls);
    console.log('state controls: ', controls);
    // console.log('proxy controls camera: ', camState.controls.camera);
    console.log('state camera: ', camera);
  });

  return (
    <>
      <group>
        {/* <polarGridHelper args={[24, 16, 24, 64]} /> */}
        {children}
      </group>
      {/* <DebugPanel />
      <SelectionPanel />
      <CameraPanel /> */}
      <ambientLight intensity={0.2} />
    </>
  );
};

export default Simulation;
