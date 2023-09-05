import { METER, PI_OVER_TWO } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  Circle,
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
import { DoubleSide, Group, Mesh, Vector3 } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { useXR } from '@react-three/xr';
import { useFrame } from '@react-three/fiber';
import { clamp } from 'three/src/math/MathUtils';

const _camWorldPos = new Vector3();
const _worldPos = new Vector3();

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
  // const isPresenting = useXR(({ isPresenting }) => isPresenting);
  const getXR = useXR(({ get }) => get);

  const inSpace = useSelector(cameraActor, (state) => state.matches('space'));

  const isVisible: boolean = (dialogOpen || vrDialogOpen) && inSpace;

  const ref = useRef<Mesh>(null!);

  const radius = 0.5e5;
  const ringArgs: [number, number, number] = useMemo(() => {
    const outerRadius = 1;
    const innerRadius = 0.75;
    const segments = 32;
    return [innerRadius, outerRadius, segments];
  }, []);

  const indicatorRef = useRef<Group>(null!);

  useFrame(({ camera }) => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    // Scale relative to distance from camera.
    camera.getWorldPosition(_camWorldPos);
    indicator.getWorldPosition(_worldPos);
    const distance = _worldPos.distanceTo(_camWorldPos);
    const { isPresenting } = getXR();
    // Increase size if in VR, to help with visibility.
    let scale = distance / 100;
    scale = clamp(scale, 1e5, 1e6) * (isPresenting ? 1.5 : 1);
    indicator.scale.setScalar(scale);
  });

  return (
    <>
      <group
        name="observation-indicator"
        visible={isVisible}
        ref={indicatorRef}
      >
        <mesh ref={ref} rotation-x={-PI_OVER_TWO}>
          <ringGeometry args={ringArgs} />

          <meshBasicMaterial side={DoubleSide} />
          {/* <axesHelper args={[1e1]} /> */}
        </mesh>
        <object3D scale-y={0.1}>
          <Cylinder position-y={0.5} scale-x={0.15} scale-z={0.15} />
        </object3D>
      </group>
    </>
  );
};
