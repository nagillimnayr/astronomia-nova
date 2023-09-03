/* eslint-disable @typescript-eslint/ban-ts-comment */
import KeplerBody from '@/simulation/classes/kepler-body';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import {
  type ColorRepresentation,
  type Object3D,
  Vector2,
  Vector3,
  Group,
  Mesh,
} from 'three';
import { Line2 } from 'three-stdlib';

const _newPos = new Vector3();

const shiftLeft = (collection: Float32Array, steps = 1): Float32Array => {
  collection.set(collection.subarray(steps));
  collection.fill(-Infinity, -steps);
  return collection;
};
// const shiftLeft = (points: number[], steps = 1): number[] => {
//   const newPoints = points.slice(steps);
//   newPoints.fill(-Infinity, -steps);
//   return newPoints;
// };

const resetTrail = (anchor: Object3D, target: Object3D, length: number) => {
  // Get relative position of target.
  target.getWorldPosition(_newPos);
  anchor.worldToLocal(_newPos);
  // Fill array with current position.
  return Float32Array.from({ length: length * 10 * 3 }, (_, i) =>
    _newPos.getComponent(i % 3)
  );
};

type ProjectedTrailProps = {
  targetRef: MutableRefObject<Object3D>;
  color?: ColorRepresentation;
  length: number;
};
export const ProjectedTrail = ({
  targetRef,
  color,
  length,
}: ProjectedTrailProps) => {
  const { timeActor, cameraActor, surfaceActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const onSurface = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );

  const getThree = useThree(({ get }) => get);
  const size = useThree(({ size }) => size);

  const anchorRef = useRef<Group>(null!);
  // const meshRef = useRef<Mesh>(null!);
  const lineRef = useRef<Line2>(null!);
  const points = useRef<Float32Array>(null!);

  useEffect(() => {
    if (!targetRef.current) return;
    const anchor = anchorRef.current;
    const target = targetRef.current;
    points.current = resetTrail(anchor, target, length);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, targetRef, targetRef.current, onSurface]);

  useEffect(() => {
    // Subscribe to surfaceActor, and reset trail whenever coordinates change.
    const subscription = surfaceActor.subscribe((state) => {
      const line = lineRef.current;
      if (!line) return;
      // Position of target won't have updated immediately, so reset the trail after a slight delay.
      line.visible = false; // Toggle visibility temporarily, to avoid jank.
      // meshRef.current.visible = false; // Toggle visibility temporarily, to avoid jank.
      setTimeout(() => {
        const anchor = anchorRef.current;
        const target = targetRef.current;
        points.current = resetTrail(anchor, target, length);
        // Update geometry.
        // line.geometry.setPoints(points.current);
        line.geometry.setPositions(points.current);

        // meshRef.current.visible = true;
        line.visible = true;
      }, 50);
    });
    return () => subscription.unsubscribe();
  }, [length, surfaceActor, targetRef]);
  useEffect(() => {
    // Subscribe to timeActor, and reset trail whenever time is paused.
    const subscription = timeActor.subscribe((state) => {
      const line = lineRef.current;
      if (!line) return;
      if (state.event.type === 'UNPAUSE') {
        // meshRef.current.visible = false;
        line.visible = false;
      }
      if (state.event.type !== 'PAUSE') return;
      // Position of target won't have updated immediately, so reset the trail after a slight delay.
      line.visible = false; // Toggle visibility temporarily, to avoid jank.
      setTimeout(() => {
        const anchor = anchorRef.current;
        const target = targetRef.current;
        points.current = resetTrail(anchor, target, length);
        // Update geometry.
        line.geometry.setPositions(points.current);

        line.visible = true;
      }, 50);
    });
    return () => subscription.unsubscribe();
  }, [length, surfaceActor, targetRef, timeActor]);

  /**  Update points. */
  useEffect(() => {
    const updatePosition = () => {
      const line = lineRef.current;
      if (!line) return;
      const anchor = anchorRef.current;

      // Get relative position of target.
      targetRef.current.getWorldPosition(_newPos);
      anchor.worldToLocal(_newPos); // Get in local coords.

      // Make room for new position.
      shiftLeft(points.current, 3);
      // Add new position to the end of the array.
      points.current.set(_newPos.toArray(), points.current.length - 3);

      // Update geometry.
      line.geometry.setPositions(points.current);
    };
    const subscription = timeActor.subscribe((state) => {
      if (state.matches('unpaused')) return; // Do nothing if unpaused.
      // Only update if the last event was a sidereal advancement of time.
      if (state.event.type !== 'ADVANCE_TIME') return;
      setTimeout(updatePosition, 30);
    });

    return () => subscription.unsubscribe();
  }, [targetRef, timeActor]);

  useFrame(() => {
    // Update geometry.
    const line = lineRef.current;
    line.geometry.setPositions(points.current);
    // geometry.setFromPoints(points.current);
  });

  // const material = useMemo(() => {
  //   const { size } = getThree();
  //   const material = new MeshLineMaterial({
  //     color: color,
  //     lineWidth: 10,
  //     sizeAttenuation: 0,
  //     resolution: new Vector2(size.width, size.height),
  //   });
  //   return material;
  // }, [color, getThree]);

  // update resolution.
  // useEffect(() => {
  //   /** @ts-ignore */
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  //   material.uniforms.resolution!.value.set(size.width, size.height);
  // }, [size, material]);
  const arr = useMemo(() => {
    return [0, 0, 0, 0, 0, 0];
  }, []);
  return (
    <>
      <group ref={anchorRef}>
        <Line ref={lineRef} points={arr} lineWidth={2} color={color} />
        {/* <axesHelper args={[1e6]} /> */}
        {/* <mesh ref={meshRef} material={material} geometry={geometry}> */}
        {/* <meshLineGeometry points={points} /> */}
        {/* <meshLineMaterial
          
            color={'white'}
            sizeAttenuation={0}
            lineWidth={0.01}
          /> */}
        {/* </mesh> */}
      </group>
    </>
  );
};
