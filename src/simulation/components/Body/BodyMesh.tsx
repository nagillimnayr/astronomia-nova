import {
  MeshDiscardMaterial,
  Sphere,
  Trail,
  useCursor,
  useHelper,
} from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import {
  type MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  BoxHelper,
  Vector3Tuple,
  type ColorRepresentation,
  type Mesh,
  type Texture,
  Vector3,
  Object3D,
} from 'three';
import type KeplerBody from '@/simulation/classes/kepler-body';

import { degToRad } from 'three/src/math/MathUtils';
// import { CoordinateSphere } from '../surface-view/CoordinateSphere';
import {
  TIME_MULT,
  DIST_MULT,
  EARTH_RADIUS,
  PI,
  PI_OVER_TWO,
  Y_AXIS,
  METER,
} from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Poles } from './poles/Poles';
import { normalizeAngle } from '../../utils/rotation-utils';
import { PlanetRing } from './planet-ring/PlanetRing';
import { Interactive, XRInteractionEvent } from '@react-three/xr';
import useHover from '@/hooks/useHover';
import { useSelector } from '@xstate/react';

type BodyMeshProps = {
  name: string;
  bodyRef: MutableRefObject<KeplerBody>;
  meanRadius: number;
  obliquity: number;
  texture?: Texture;
  color?: ColorRepresentation;
  siderealRotRate: number;
};

export const BodyMesh = forwardRef<Mesh, BodyMeshProps>(function BodyMesh(
  {
    name,
    bodyRef,
    meanRadius,
    obliquity,
    texture,
    color,
    siderealRotRate,
  }: BodyMeshProps,
  fwdRef
) {
  const { selectionActor, timeActor, surfaceActor, cameraActor, uiActor } =
    MachineContext.useSelector(({ context }) => context);

  const meshRef = useRef<Mesh>(null!);

  // const [isVisible, setVisible] = useState<boolean>(true);

  // const [isSelected, setSelected] = useState<boolean>(false);
  //const [isTrailVisible, setTrailVisibility] = useState<boolean>(false);

  // Set forwarded ref, the return value of the callback function will be assigned to fwdRef.
  useImperativeHandle(
    fwdRef,
    () => {
      return meshRef.current;
    },
    [meshRef]
  );

  useEffect(() => {
    // Subscribe to updates from timeActor.
    const subscription = timeActor.subscribe((state) => {
      const mesh = meshRef.current;
      if (!mesh) return;
      const eventType = state.event.type;
      // Only relevant if time has changed.
      if (eventType !== 'UPDATE' && eventType !== 'ADVANCE_TIME') return;

      // Rotation rate is constant, so the current rotation can be found as a simple function of time.
      const timeElapsed = state.context.timeElapsed;
      const axialRotation = normalizeAngle(siderealRotRate * timeElapsed);

      // Rotate the body around its rotational axis.
      mesh.rotation.set(PI_OVER_TWO, 0, degToRad(obliquity)); // Reset rotation.
      mesh.rotateY(axialRotation); // Rotate around local y-axis.
    });

    return () => subscription.unsubscribe();
  }, [obliquity, siderealRotRate, timeActor]);

  const radius = meanRadius * METER;
  const rotation: Vector3Tuple = useMemo(
    () => [PI_OVER_TWO, 0, degToRad(obliquity)],
    [obliquity]
  );
  return (
    <>
      <group>
        <Sphere
          name={name + '-mesh'}
          rotation={rotation}
          // visible={isVisible}
          ref={meshRef}
          args={[radius, 128, 128]}
          // onPointerDown={handleClick}
          // onPointerEnter={hoverEvents.handlePointerEnter}
          // onPointerLeave={hoverEvents.handlePointerLeave}
          // onPointerMissed={handleMiss}
        >
          <meshBasicMaterial map={texture} />
          {/* <axesHelper args={[2 * radius]} /> */}
          <InteractionSphere radius={meanRadius} />
          {/* <Trail target={meshRef} color={'white'} width={150} length={100} /> */}
        </Sphere>
        {name === 'Saturn' && (
          <PlanetRing
            rotation={rotation}
            innerRadius={(meanRadius + 7e6) / DIST_MULT}
            outerRadius={(meanRadius + 80e6) / DIST_MULT}
            // onPointerDown={handleClick}
          />
        )}
        <Poles rotation={rotation} length={2 * radius} />
      </group>
    </>
  );
});

// Invisible sphere for catching XRInteractions.
type InteractionSphereProps = {
  radius: number;
};
const InteractionSphere = ({ radius }: InteractionSphereProps) => {
  const { surfaceActor, cameraActor, uiActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const { surfaceDialogActor, vrSurfaceDialogActor } = useSelector(
    uiActor,
    ({ context }) => context
  );

  const onSurface = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );

  const objRef = useRef<Object3D>(null!);
  const meshRef = useRef<Mesh>(null!);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      const mesh = meshRef.current;
      if (!mesh) {
        // Should not be possible.
        console.error('mesh is invalid. This should not be possible.');
        return;
      }
      // Get point of intersection.
      let point: Vector3 = null!;
      if ('stopPropagation' in event) {
        event.stopPropagation();
        point = event.point;
      } else {
        if (!event.intersection) return;
        point = event.intersection.point;
      }
      // Check if in surface view mode.
      const onSurface = cameraActor.getSnapshot()!.matches('surface');
      if (onSurface) return; // If on surface, do nothing.

      // Get position relative to the body.
      mesh.worldToLocal(point);

      // Set latitude/ longitude from point.
      surfaceActor.send({ type: 'SET_COORDS_FROM_VECTOR', pos: point });

      // Open surface dialog.
      surfaceDialogActor.send({ type: 'OPEN' });
      vrSurfaceDialogActor.send({ type: 'ENABLE' });
    },
    [cameraActor, surfaceActor, surfaceDialogActor, vrSurfaceDialogActor]
  );

  return (
    <object3D ref={objRef} scale={onSurface ? 0 : 1}>
      <Interactive onSelect={handleClick}>
        <Sphere ref={meshRef} scale={radius} onClick={handleClick}>
          <MeshDiscardMaterial />
        </Sphere>
      </Interactive>
    </object3D>
  );
};
