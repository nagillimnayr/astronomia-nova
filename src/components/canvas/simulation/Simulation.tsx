import React from 'react';
import { useFrame } from '@react-three/fiber';

import { MachineContext } from '@/state/xstate/MachineProviders';
import { ObservationPoint } from '@/components/canvas/surface-view/observation-point/ObservationPoint';
import { KeyPressControl } from '../KeyPressControl';
import { VRSurfaceDialog } from '@/components/canvas/vr/vr-hud/vr-details-panel/VRSurfaceDialog';
import { PseudoTrajectory } from '@/components/canvas/orbit/trajectroy/PseudoTrajectory';
import { CelestialSphere } from '@/components/canvas/celestial-sphere/CelestialSphere';

type SimProps = {
  children: React.ReactNode;
};
const Simulation = ({ children }: SimProps) => {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  console.log('render Simulation');

  useFrame(({ clock, camera }, delta) => {
    // Update simulation.
    rootActor.send({ type: 'UPDATE', deltaTime: delta });
    // Update camera.
    cameraActor.send({ type: 'UPDATE', deltaTime: delta });
  }, -10);

  return (
    <>
      <group>
        <group>
          <CelestialSphere />
          {/* <group rotation-x={-PI_OVER_TWO}> */}
          {children}
          {/* </group> */}
        </group>

        <ambientLight intensity={0.5} />
        <ObservationPoint />
        <KeyPressControl />
        <VRSurfaceDialog />
        <PseudoTrajectory />
      </group>
    </>
  );
};

export default Simulation;
