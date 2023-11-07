import { CelestialSphere } from '@/components/canvas/celestial-sphere/CelestialSphere';
import { PseudoTrajectory } from '@/components/canvas/orbit/Trajectory';
import { ObservationPoint } from '@/components/canvas/surface-view/observation-point/ObservationPoint';
import { VRSurfaceDialog } from '@/components/canvas/vr/vr-hud/vr-details-panel/VRSurfaceDialog';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, type PropsWithChildren } from 'react';

export const Simulation = ({ children }: PropsWithChildren) => {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  useEffect(() => {
    timeActor.send({ type: 'RESET' });

    setTimeout(() => {
      timeActor.send({ type: 'SET_DATE_TO_NOW' });
    }, 30);
  }, [timeActor]);

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
      </group>
    </>
  );
};
