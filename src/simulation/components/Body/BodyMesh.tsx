import {
  Circle,
  MeshDiscardMaterial,
  Sphere,
  Trail,
  useCursor,
  useHelper,
} from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
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
  DoubleSide,
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
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';

const _centralWorldPos = new Vector3();

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

  const objRef = useRef<Object3D>(null!);
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
      mesh.rotation.set(0, axialRotation, 0); // Rotate around local y-axis.
      // mesh.rotateY(axialRotation); // Rotate around local y-axis.
    });

    return () => subscription.unsubscribe();
  }, [obliquity, siderealRotRate, timeActor]);

  useEffect(() => {
    // Make the prime meridian face the central body.
    const body = bodyRef.current;
    if (!body) return;
    const parent = body.parent;
    if (!(parent instanceof KeplerOrbit)) return;
    const centralBody = parent.centralBodyRef.current;
    if (!centralBody) return;
    // _centralWorldPos.set(0, 0, 0);
    centralBody.getWorldPosition(_centralWorldPos);
    // body.localToWorld(_centralWorldPos);
    const obj = objRef.current;
    obj.lookAt(_centralWorldPos);
    obj.rotateY(-PI_OVER_TWO);
    // obj.rotateZ(-PI_OVER_TWO);
  }, [bodyRef]);

  const radius = meanRadius * METER;
  const rotation: Vector3Tuple = useMemo(
    () => [0, 0, degToRad(obliquity)],
    [obliquity]
  );
  return (
    <>
      <object3D ref={objRef}>
        {/* <axesHelper args={[3 * radius]} /> */}
        <group rotation={rotation}>
          {/* <axesHelper args={[3 * radius]} /> */}
          <Sphere
            name={name + '-mesh'}
            // rotation={rotation}
            // visible={isVisible}
            ref={meshRef}
            args={[radius, 128, 128]}
          >
            <meshBasicMaterial map={texture} />
            <InteractionSphere radius={meanRadius} />
            {/* <axesHelper args={[3 * radius]} /> */}
            {/* <Circle scale={radius * 2}>
              <meshBasicMaterial side={DoubleSide} />
            </Circle> */}
            {/* <Trail target={meshRef} color={'white'} width={150} length={100} /> */}
          </Sphere>
          {name === 'Saturn' && (
            <PlanetRing
              innerRadius={(meanRadius + 7e6) / DIST_MULT}
              outerRadius={(meanRadius + 80e6) / DIST_MULT}
            />
          )}
          <Poles length={2 * radius} />
        </group>
      </object3D>
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
