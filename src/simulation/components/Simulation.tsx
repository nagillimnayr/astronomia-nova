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
import SunEarthMars from './SolarSystem/SunEarthMars';
import { retrogradeState } from './Retrograde/retrogradeState';
import { selectState } from '../state/SelectState';
import { SelectionPanel } from './leva/SelectionPanel';
import { CameraPanel } from './leva/CameraPanel';
import { CameraTarget } from './Camera/CameraTarget';
import { Vector3 } from 'three';

type SimProps = {
  children: React.ReactNode;
};
const Simulation = (props: SimProps) => {
  console.log('render Simulation');
  // function for accessing scene state
  const getState = useThree((state) => state.get);
  simState.getState = getState;

  useFrame(({ clock, camera }, delta) => {
    // camState.controls.update(delta);
    // update camera
    camState.updateControls();
    if (!timeState.isPaused) {
      // scale delta time
      const scaledDelta = delta * timeState.timescale;
      timeState.updateClock(scaledDelta);

      simState.updateIteration += 1;

      // if (selectState.selected) {
      //   const selected = selectState.selected;
      //   const gazeTarget = new Vector3();
      //   camState.controls.getTarget(gazeTarget).toArray();
      //   const gazeTargetLocal = selected.worldToLocal(gazeTarget);
      //   console.log('selected', {
      //     updateIteration: simState.updateIteration,
      //     name: selected.name,
      //     position: selected.position.toArray(),
      //     id: selected.id,
      //     camTargetPosition: camState.focusTarget?.position.toArray(),
      //     camLookPosition: camState.controls
      //       .getTarget(gazeTargetLocal)
      //       .toArray(),
      //   });
      // }
      // camera.

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
      console.log('camera: ', camState.controls.camera);
      console.log('camera state: ', camState);
    }
  });

  return (
    <>
      <group>
        {/* <polarGridHelper args={[24, 16, 24, 64]} /> */}
        {/* <SolarSystem /> */}
        {props.children}
        {/* <EarthMars /> */}
      </group>
      {/* <DebugPanel />
      <SelectionPanel />
      <CameraPanel /> */}
      <CameraTarget />
      <ambientLight intensity={0.2} />
    </>
  );
};

export default Simulation;
