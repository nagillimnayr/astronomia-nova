import { MachineContext } from '@/state/xstate/MachineProviders';
import { Edges, Sphere, Wireframe } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { useContext, useRef } from 'react';
import { type Mesh } from 'three';

export const ObservationSphere = () => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const dialogActor = useSelector(
    uiActor,
    ({ context }) => context.surfaceDialogActor
  );
  const dialogOpen = useSelector(dialogActor, (state) => state.matches('open'));

  const sphereRef = useRef<Mesh>(null!);
  return (
    <>
      <Sphere
        name="observation-sphere"
        visible={dialogOpen}
        ref={sphereRef}
        args={[1e-3, 16, 16]}
      >
        <meshBasicMaterial transparent opacity={0} />
        <Edges scale={1} color={'white'} threshold={5.5} />
        {/* <axesHelper args={[1e-1]} /> */}
      </Sphere>
    </>
  );
};
