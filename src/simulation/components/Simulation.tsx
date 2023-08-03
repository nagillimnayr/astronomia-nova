import React, { useContext, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import { retrogradeState } from './Retrograde/retrogradeState';
import { useKeyPressed } from '@react-hooks-library/core';
import { useTimeStore } from '../state/zustand/time-store';
import { useSimStore } from '../state/zustand/sim-store';
import { useCameraStore } from '../state/zustand/camera-store';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { CameraControls } from '@react-three/drei';
import {
  GlobalStateContext,
  RootActorContext,
} from '@/state/xstate/MachineProviders';
import { ObservationPoint } from './surface-view/observation-point/ObservationPoint';
import SolarSystem from './SolarSystem/SolarSystem';

type SimProps = {
  children: React.ReactNode;
};
const Simulation = ({ children }: SimProps) => {
  const { cameraService } = useContext(GlobalStateContext);
  const rootActor = RootActorContext.useActorRef();

  console.log('render Simulation');
  // function for accessing scene state
  const getThree = useThree((state) => state.get);

  useEffect(() => {
    // Reset timers, timescale, etc when the component is mounted.
    console.log('resetting timeStore!');
    useTimeStore.getState().reset();
  }, []);

  useFrame(({ clock, camera }, delta) => {
    rootActor.send({ type: 'UPDATE', deltaTime: delta });

    // Update camera.
    cameraService.send({ type: 'UPDATE', deltaTime: delta });
  });

  useKeyPressed(' ', (evt) => {
    evt.preventDefault();
    // const { camera, controls } = getThree();

    // const camControls = controls as unknown as CameraControls;
    // console.log('Distance to gaze target:', camControls.distance);
    rootActor.send({ type: 'LOG_CHILDREN' });
  });

  return (
    <>
      <SolarSystem>{children}</SolarSystem>

      <ambientLight intensity={0.9} />
      <ObservationPoint />
    </>
  );
};

export default Simulation;
