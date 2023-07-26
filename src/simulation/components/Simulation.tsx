import React, { useContext, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import { retrogradeState } from './Retrograde/retrogradeState';
import { useKeyPressed } from '@react-hooks-library/core';
import { useTimeStore } from '../state/zustand/time-store';
import { useSimStore } from '../state/zustand/sim-store';
import { useCameraStore } from '../state/zustand/camera-store';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { CameraControls } from '@react-three/drei';

type SimProps = {
  children: React.ReactNode;
};
const Simulation = ({ children }: SimProps) => {
  const { cameraState } = useContext(RootStoreContext);
  console.log('render Simulation');
  // function for accessing scene state
  const getThree = useThree((state) => state.get);
  // simState.getState = getThree;

  useEffect(() => {
    // Reset timers, timescale, etc when the component is mounted.
    console.log('resetting timeStore!');
    useTimeStore.getState().reset();
  }, []);

  useFrame(({ clock, camera }, delta) => {
    // get state without subscribing to it
    const timeStore = useTimeStore.getState();
    if (!timeStore.isPaused) {
      // scale delta time
      const scaledDelta = delta * timeStore.timescale;

      // Update clock in external store.
      timeStore.addTimeToClock(scaledDelta);

      // Pass rootRef.current to function instead?
      useSimStore
        .getState()
        .updateSim(useSimStore.getState().rootRef.current, scaledDelta);

      retrogradeState.update();
    }

    // Update camera.
    cameraState.updateCamera(delta);
    // useCameraStore.getState().updateCameraControls();
  });

  useKeyPressed(' ', (evt) => {
    evt.preventDefault();
    // const { camera, controls } = getThree();

    // const camControls = controls as unknown as CameraControls;
    // console.log('Distance to gaze target:', camControls.distance);
  });

  return (
    <>
      <group>
        {/* <polarGridHelper args={[24, 16, 24, 64]} /> */}
        {children}
      </group>

      <ambientLight intensity={0.9} />
    </>
  );
};

export default Simulation;
