import React, { MutableRefObject, useContext, useRef } from 'react';
import SolarSystem, { UpdateFn } from './SolarSystem/SolarSystem';
import { useFrame, useThree } from '@react-three/fiber';
import {
  PerspectiveCamera,
  OrbitControls,
  CameraControls,
} from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { simState } from '../state/SimState';
import { useEventListener, useTimeout } from 'usehooks-ts';
//import { type CameraControls as CameraController } from 'three-stdlib';
import { timeState } from '../state/TimeState';

//type SimProps = {};
const Simulation = () => {
  // function for accessing scene state
  const getState = useThree((state) => state.get);
  simState.getState = getState;

  // set clock to be stopped initially
  //getState().clock.stop();

  // reference to update function that will be passed back up by the SolarSystem component
  const updateRef = useRef<UpdateFn>(null!);

  // camera controls ref
  //const controlsRef = useRef<OrbitController>(null!);
  const controlsRef = useRef<CameraControls>(null!);

  useFrame(({ clock }, delta) => {
    if (timeState.isPaused) {
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
      const state = getState();
      console.log('state controls: ', state.controls);
      console.log('simState controls: ', simState.controls);
      console.log('state camera: ', state.camera);
      console.log('simState controls camera: ', simState.controls.camera);
      console.log('selected: ', simState.selected);
    }
  });

  return (
    <>
      <group>
        {/* <polarGridHelper args={[24, 16, 24, 64]} /> */}
        <SolarSystem ref={updateRef} />
      </group>

      {/* <OrbitControls
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
      /> */}

      <ambientLight intensity={0.1} />
    </>
  );
};

export default Simulation;
