import { MachineContext } from '@/state/xstate/MachineProviders';
import { Sphere, Wireframe } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { useContext, useRef } from 'react';
import { type Mesh } from 'three';

export const ObservationSphere = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const isVisible = useSelector(cameraActor, (state) => state.matches('space'));

  const sphereRef = useRef<Mesh>(null!);
  return (
    <>
      <Sphere
        name="observation-sphere"
        visible={isVisible}
        ref={sphereRef}
        args={[1e-2]}
      >
        <Wireframe
          simplify
          stroke="white"
          squeeze
          fillMix={1}
          fillOpacity={0.01}
        />
        {/* <axesHelper args={[1e-1]} /> */}
      </Sphere>
    </>
  );
};
