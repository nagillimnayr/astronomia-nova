import { METER, PI_OVER_TWO } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  Cylinder,
  Edges,
  Line,
  MeshDiscardMaterial,
  Sphere,
  Wireframe,
} from '@react-three/drei';
import { WireframeMaterial } from '@react-three/drei/materials/WireframeMaterial';
import { useSelector } from '@xstate/react';
import { useContext, useMemo, useRef } from 'react';
import { Mesh, Vector3 } from 'three';

export const ObservationPointIndicator = () => {
  const { uiActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const surfaceDialogActor = useSelector(
    uiActor,
    ({ context }) => context.surfaceDialogActor
  );
  const vrSurfaceDialogActor = useSelector(
    uiActor,
    ({ context }) => context.vrSurfaceDialogActor
  );
  const dialogOpen = useSelector(surfaceDialogActor, (state) =>
    state.matches('open')
  );
  const vrDialogOpen = useSelector(vrSurfaceDialogActor, (state) =>
    state.matches('active')
  );

  const inSpace = useSelector(cameraActor, (state) => state.matches('space'));

  const isVisible: boolean = (dialogOpen || vrDialogOpen) && inSpace;

  const ref = useRef<Mesh>(null!);

  const radius = 0.5e5;
  const ringArgs: [number, number, number] = useMemo(() => {
    const outerRadius = 1;
    const innerRadius = 0.9;
    const segments = 32;
    return [innerRadius, outerRadius, segments];
  }, []);

  return (
    <>
      <group name="observation-indicator" scale={radius}>
        <mesh ref={ref} visible={isVisible} rotation-x={-PI_OVER_TWO}>
          <ringGeometry args={ringArgs} />

          <meshBasicMaterial />
          {/* <axesHelper args={[1e1]} /> */}
        </mesh>

        <Cylinder scale-x={0.1} scale-y={5} scale-z={0.075} />
      </group>
    </>
  );
};
