import { METER, PI_OVER_TWO } from '@/simulation/utils/constants';
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
import { Mesh } from 'three';

export const ObservationPointIndicator = () => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const dialogActor = useSelector(
    uiActor,
    ({ context }) => context.surfaceDialogActor
  );
  const dialogOpen = useSelector(dialogActor, (state) => state.matches('open'));

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
      <mesh
        ref={ref}
        name="observation-sphere"
        visible={dialogOpen}
        scale={radius}
        rotation-x={-PI_OVER_TWO}
      >
        <ringGeometry args={ringArgs} />

        <meshBasicMaterial />
        {/* <axesHelper args={[1e-1]} /> */}
      </mesh>
    </>
  );
};
