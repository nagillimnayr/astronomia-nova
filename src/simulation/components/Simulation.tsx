import React, { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import { Leva, useControls } from 'leva';
import { DebugPanel } from './leva/DebugPanel';
import { retrogradeState } from './Retrograde/retrogradeState';
import { SelectionPanel } from './leva/SelectionPanel';
import { CameraPanel } from './leva/CameraPanel';
import { useKeyPressed } from '@react-hooks-library/core';
import { useTimeStore } from '../state/zustand/time-store';
import { useSimStore } from '../state/zustand/sim-store';
import { useCameraStore } from '../state/zustand/camera-store';
import { CameraControls } from '@react-three/drei';

type SimProps = {
  children: React.ReactNode;
};
const Simulation = ({ children }: SimProps) => {
  console.log('render Simulation');
  // function for accessing scene state
  const getThree = useThree((state) => state.get);
  // simState.getState = getThree;

  useEffect(() => {
    // reset timers, timescale, etc when the component is mounted
    console.log('resetting timeStore!');
    useTimeStore.getState().reset();
  }, []);

  useFrame(({ clock, camera }, delta) => {
    // get state without subscribing to it
    const timeStore = useTimeStore.getState();
    if (!timeStore.isPaused) {
      // scale delta time
      const scaledDelta = delta * timeStore.timescale;

      // update clock in external state
      timeStore.addTimeToClock(scaledDelta);

      // pass rootRef.current to function instead?
      useSimStore.getState().updateSim(scaledDelta);

      retrogradeState.update();
    }

    // update camera
    useCameraStore.getState().updateCameraControls();
  });

  useKeyPressed(' ', (evt) => {
    evt.preventDefault();
    const { camera, controls } = getThree();

    console.log('three state controls: ', controls);
    console.log('three state camera: ', camera);
    console.log(
      'cameraStore focusTarget:',
      useCameraStore.getState().focusTarget
    );
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
