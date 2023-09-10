import { CelestialSphere } from '@/components/canvas/celestial-sphere/CelestialSphere';
import { PseudoTrajectory } from '@/components/canvas/orbit/trajectory/PseudoTrajectory';
import { ObservationPoint } from '@/components/canvas/surface-view/observation-point/ObservationPoint';
import { VRSurfaceDialog } from '@/components/canvas/vr/vr-hud/vr-details-panel/VRSurfaceDialog';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useFrame } from '@react-three/fiber';
import React, { type PropsWithChildren } from 'react';

const Simulation = ({ children }: PropsWithChildren) => {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  useFrame((_, delta) => {
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
        <VRSurfaceDialog />
        <PseudoTrajectory />
      </group>
    </>
  );
};

export default Simulation;
