import KeplerBody from '@/simulation/classes/kepler-body';
import { MutableRefObject, useMemo, useRef } from 'react';
import { Annotation } from '@/simulation/components/Body/tags/annotation/Annotation';
import { RingMarker } from '@/simulation/components/Body/tags/marker/RingMarker';
import { CircleMarker } from '@/simulation/components/Body/tags/marker/CircleMarker';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { colorMap } from '@/simulation/utils/color-map';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';

const threshold = 0.02;

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();

type Props = {
  name: string;
  bodyRef: MutableRefObject<KeplerBody>;
  meanRadius: number;
};
export const Tags = ({ name, bodyRef, meanRadius }: Props) => {
  // const { mapActor } = MachineContext.useSelector(({ context }) => context);
  // const bodyMap = useSelector(mapActor, ({ context }) => context.bodyMap);

  // const body = useMemo(() => {
  //   const body = bodyMap.get(name);
  //   return body;
  // }, [bodyMap, name]);

  const color = useMemo(() => {
    const color = colorMap.get(name);
    return color;
  }, [name]);

  const groupRef = useRef<Group>(null!);

  useFrame(({ camera }) => {
    const body = bodyRef.current;
    if (!body) return;
    const group = groupRef.current;
    if (!group) return;

    body.getWorldPosition(_bodyWorldPos);
    // Get distance to camera.
    camera.getWorldPosition(_camWorldPos);
    const distanceToCamera = _bodyWorldPos.distanceTo(_camWorldPos);

    // Since the local coordinates will have the parent at the origin, we can use the body's local coords to get the distance to the parent.
    const distanceToParent = body.position.length();
    // Check the ratio of the distances to the parent and the camera.
    const ratio = distanceToParent / distanceToCamera;

    // The primary body of the system won't be parented to a KeplerOrbit object.
    const isOrbiter = body.parent instanceof KeplerOrbit;
    if (!isOrbiter) return;

    // If the ratio of distances is less than the threshold, set to be invisible.
    group.visible = ratio > threshold;
  });

  return (
    <group ref={groupRef}>
      <RingMarker bodyRef={bodyRef} />
      <CircleMarker bodyRef={bodyRef} color={color ?? 'white'} />
      <Annotation annotation={name} meanRadius={meanRadius} />
    </group>
  );
};
