import { METER } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  Edges,
  MeshDiscardMaterial,
  Sphere,
  Wireframe,
} from '@react-three/drei';
import { WireframeMaterial } from '@react-three/drei/materials/WireframeMaterial';
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
  const radius = 0.5e5 * METER;
  const resolution = 16;
  return (
    <>
      <Sphere
        name="observation-sphere"
        visible={dialogOpen}
        ref={sphereRef}
        args={[radius, resolution, resolution]}
      >
        <Wireframe
          simplify
          fillOpacity={0}
          colorBackfaces
          fillMix={1}
          stroke={'white'}
          backfaceStroke={'white'}
        />
        {/* <Edges scale={1} color={'white'} threshold={1} /> */}
        {/* <axesHelper args={[1e-1]} /> */}
      </Sphere>
    </>
  );
};
