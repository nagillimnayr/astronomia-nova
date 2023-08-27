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
import { useContext, useMemo, useRef } from 'react';
import { SphereGeometry, type Mesh } from 'three';

export const ObservationSphere = () => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const dialogActor = useSelector(
    uiActor,
    ({ context }) => context.surfaceDialogActor
  );
  const dialogOpen = useSelector(dialogActor, (state) => state.matches('open'));

  const sphereRef = useRef<Mesh>(null!);

  const sphereGeometry = useMemo(() => {
    const radius = 0.5e5 * METER;
    const resolution = 16;
    const geometry = new SphereGeometry(radius, resolution, resolution);
    const nonIndexedGeometry = geometry.toNonIndexed(); // Necessary for wireframe.
    geometry.dispose(); // Cleanup original indexed geometry.
    return nonIndexedGeometry;
  }, []);
  return (
    <>
      <mesh
        ref={sphereRef}
        name="observation-sphere"
        visible={dialogOpen}
        geometry={sphereGeometry}
      >
        <Wireframe
          // geometry={sphereGeometry}
          simplify
          fillOpacity={0}
          colorBackfaces
          fillMix={1}
          stroke={'white'}
          backfaceStroke={'white'}
        />
        {/* <axesHelper args={[1e-1]} /> */}
      </mesh>
    </>
  );
};
