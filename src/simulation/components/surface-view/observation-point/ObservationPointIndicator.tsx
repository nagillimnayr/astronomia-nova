import { METER, PI_OVER_TWO } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
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
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
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
  const isVisible = dialogOpen || vrDialogOpen;

  const ref = useRef<Mesh>(null!);

  const radius = 0.5e5;
  const ringArgs: [number, number, number] = useMemo(() => {
    const outerRadius = 1;
    const innerRadius = 0.9;
    const segments = 32;
    return [innerRadius, outerRadius, segments];
  }, []);
  const linePoints = useMemo(() => {
    return [new Vector3(0, 0, 0), new Vector3(0, 0, 1)];
  }, []);
  const lineScale = useMemo(() => {
    return new Vector3(1, 1, 1);
  }, []);
  lineScale.set(1, 1, 4);
  return (
    <>
      <mesh
        ref={ref}
        name="observation-sphere"
        visible={isVisible}
        scale={radius}
        rotation-x={-PI_OVER_TWO}
      >
        <ringGeometry args={ringArgs} />

        <meshBasicMaterial />
        <Line
          points={linePoints}
          color={'white'}
          lineWidth={2}
          scale={lineScale}
        />
        {/* <axesHelper args={[1e1]} /> */}
      </mesh>
    </>
  );
};
