import { MachineContext } from '@/state/xstate/MachineProviders';
import { useTexture, Wireframe } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { useMemo, useRef } from 'react';
import { type Mesh, SphereGeometry } from 'three';

type ObservationSphereProps = {
  radius: number;
};
export const ObservationSphere = ({ radius }: ObservationSphereProps) => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const dialogActor = useSelector(
    uiActor,
    ({ context }) => context.surfaceDialogActor
  );
  const dialogOpen = useSelector(dialogActor, (state) => state.matches('open'));

  const sphereRef = useRef<Mesh>(null!);

  const gridTexture = useTexture(
    'assets/textures/stars/celestial_grid_16k.jpg'
  );

  const sphereGeometry = useMemo(() => {
    // const radius = 0.5e5 * METER;
    const resolution = 16;
    const geometry = new SphereGeometry(radius, resolution, resolution);
    const nonIndexedGeometry = geometry.toNonIndexed(); // Necessary for
    // wireframe.
    geometry.dispose(); // Cleanup original indexed geometry.
    return nonIndexedGeometry;
  }, [radius]);
  return (
    <>
      <mesh
        ref={sphereRef}
        name="observation-sphere"
        // visible={dialogOpen}
        geometry={sphereGeometry}
        scale-x={-1}
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
        {/* <meshBasicMaterial
         color={'white'}
         alphaMap={gridTexture}
         side={DoubleSide}
         transparent
         /> */}
        {/* <axesHelper args={[1e-1]} /> */}
      </mesh>
    </>
  );
};