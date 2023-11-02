import { type KeplerBody } from '@/components/canvas/body/kepler-body';
import { PlanetRing } from '@/components/canvas/body/PlanetRing';
import {
  METER,
  ORIGIN,
  PI,
  PI_OVER_TWO,
  X_AXIS,
  Y_AXIS,
  Z_AXIS,
} from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { MeshDiscardMaterial, Sphere } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { useSelector } from '@xstate/react';
import {
  forwardRef,
  type MutableRefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  type Mesh,
  type Object3D,
  Vector3,
  type Vector3Tuple,
  type Material,
  ArrowHelper,
} from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { normalizeAngle } from '@/helpers/rotation-utils';
import { getLocalUpInWorldCoords } from '@/helpers/vector-utils';

/**
 * @module Body
 * @mergeTarget
 */

const _centralWorldPos = new Vector3();

/**
 * The props type for {@link BodyMesh}
 * @category Props
 */
export type BodyMeshProps = {
  name: string;
  bodyRef: MutableRefObject<KeplerBody>;
  meanRadius: number;
  obliquity: number;
  material?: Material;
  siderealRotationRate: number;
};
/**
 * Component that manages the visual logic of the associated body. Renders the body's mesh, and handles the sidereal rotation.
 * @category Component
 */
export const BodyMesh = forwardRef<Mesh, BodyMeshProps>(function BodyMesh(
  {
    name,
    bodyRef,
    meanRadius,
    obliquity,
    material,
    siderealRotationRate,
  }: BodyMeshProps,
  fwdRef
) {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const meridianRef = useRef<Object3D>(null!);
  const rotatorRef = useRef<Object3D>(null!);
  const meshRef = useRef<Mesh>(null!);

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
      /* Rotation rate is constant, so the current rotation can be found as a  simple function of time. */
      const timeElapsed = state.context.timeElapsed;
      const axialRotation = normalizeAngle(siderealRotationRate * timeElapsed);

      // Rotate the body around its rotational axis.
      rotatorRef.current.rotation.set(0, axialRotation, 0); // Rotate around local y-axis.
    });

    return () => subscription.unsubscribe();
  }, [obliquity, siderealRotationRate, timeActor]);

  const resetPrimeMeridian = useCallback(() => {
    // Central body will be at local zero-vector.
    _centralWorldPos.set(0, 0, 0);
    const body = bodyRef.current;
    if (!body) return;
    const orbit = body.parent;
    if (!orbit) return;
    const obj = meridianRef.current;
    orbit.localToWorld(_centralWorldPos);
    getLocalUpInWorldCoords(obj, obj.up);
    obj.lookAt(_centralWorldPos);
  }, [bodyRef]);

  useEffect(() => {
    const subscription = timeActor.subscribe((state) => {
      if (state.event.type !== 'RESET') return;

      setTimeout(resetPrimeMeridian, 30);
    });

    return () => subscription.unsubscribe();
  }, [resetPrimeMeridian, timeActor]);

  // const arrowRef = useRef<ArrowHelper>(null!);
  const arrowRef = useRef<Object3D>(null!);

  const radius = meanRadius * METER;
  const rotation: Vector3Tuple = useMemo(
    () => [-degToRad(obliquity), 0, 0],
    [obliquity]
  );
  const sphereArgs = useMemo(() => {
    const args: [number, number, number] = [radius, 128, 128];
    return args;
  }, [radius]);
  return (
    <>
      <object3D ref={meridianRef}>
        {/* <arrowHelper args={[Z_AXIS, ORIGIN, radius * 3e9, 'lightgreen']} /> */}
        <group rotation={rotation}>
          {/* <arrowHelper args={[X_AXIS, ORIGIN, radius * 3, 'orange']} /> */}
          {/* <arrowHelper args={[Y_AXIS, ORIGIN, radius * 3, 'pink']} /> */}
          <object3D ref={arrowRef}>
            {/* <arrowHelper args={[Z_AXIS, ORIGIN, radius * 3, 'magenta']} /> */}
          </object3D>
          {/* <arrowHelper args={[Z_AXIS, ORIGIN, radius * 3, 'lightgreen']} /> */}
          {/* <arrowHelper args={[Y_AXIS, ORIGIN, radius * 3, 'yellow']} /> */}
          <object3D ref={rotatorRef}>
            {/* <object3D rotation-y={-PI_OVER_TWO}> */}
            {/* <arrowHelper args={[X_AXIS, ORIGIN, radius * 3, 'orange']} /> */}
            {/* <arrowHelper args={[Z_AXIS, ORIGIN, radius * 3, 'cyan']} /> */}
            <Sphere
              name={name + '-mesh'}
              ref={meshRef}
              args={sphereArgs}
              material={material}
              rotation-y={-PI_OVER_TWO}
              // onBeforeRender={onBeforeRender}
            >
              {/* <axesHelper scale={radius * 3} /> */}
              {/* <arrowHelper args={[X_AXIS, ORIGIN, radius * 3, 'orange']} /> */}
              {/* <arrowHelper args={[Y_AXIS, ORIGIN, radius * 3, 'yellow']} /> */}
              {/* <arrowHelper args={[Z_AXIS, ORIGIN, radius * 3, 'cyan']} /> */}
              <InteractionSphere radius={meanRadius} />
            </Sphere>
            {name === 'Saturn' && (
              <PlanetRing
                innerRadius={(meanRadius + 7e6) * METER}
                outerRadius={(meanRadius + 80e6) * METER}
              />
            )}
          </object3D>
        </group>
      </object3D>
    </>
  );
});

// Invisible sphere for catching XRInteractions.
type InteractionSphereProps = {
  radius: number;
};
/**
 * @description Invisible sphere mesh to manage interaction events.
 * @author Ryan Milligan
 * @date Sep/09/2023
 * @param  {number} [radius] The radius of the sphere mesh.
 * @returns {JSX.Element}
 */
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
