import { Sphere, Trail, useCursor, useHelper } from '@react-three/drei';
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
} from 'react';
import {
  BoxHelper,
  type ColorRepresentation,
  type Mesh,
  type Texture,
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
} from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Poles } from './poles/Poles';

// Separate out the visual logic from the simulation logic.

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
  const { selectionActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const meshRef = useRef<Mesh>(null!);

  // const [isVisible, setVisible] = useState<boolean>(true);

  // const [isSelected, setSelected] = useState<boolean>(false);
  const [isHovered, setHovered] = useState<boolean>(false);
  //const [isTrailVisible, setTrailVisibility] = useState<boolean>(false);
  useCursor(isHovered, 'pointer');

  // event handlers
  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (!meshRef.current || !bodyRef.current) {
        return;
      }
      const body: KeplerBody = bodyRef.current;
      // Select body.
      selectionActor.send({ type: 'SELECT', selection: body });
    },
    [bodyRef, selectionActor]
  );
  // const handleMiss = (e: MouseEvent) => {
  //   if (!meshRef.current) return;
  //   // if (isSelected) {
  //   //   // setSelected(false);
  //   // }
  // };

  // Set forwarded ref
  // the return value of the callback function will be assigned to fwdRef
  useImperativeHandle(
    fwdRef,
    () => {
      return meshRef.current;
    },
    [meshRef]
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const subscription = timeActor.subscribe((state) => {
      const eventType = state.event.type;
      if (eventType !== 'UPDATE' && eventType !== 'ADVANCE_TIME') return;

      const timeElapsed = state.context.timeElapsed;
      const axialRotation = siderealRotRate * timeElapsed;

      // Rotate the body around its rotational axis.
      mesh.rotation.set(PI_OVER_TWO, 0, degToRad(obliquity)); // Reset rotation.
      mesh.rotateY(axialRotation); // Rotate around local y-axis.
    });

    return () => subscription.unsubscribe();
  }, [obliquity, siderealRotRate, timeActor]);

  // useFrame((state, delta) => {
  //   const timeSnapshot = timeActor.getSnapshot();
  //   if (!timeSnapshot) return;

  //   const mesh = meshRef.current;
  //   if (!mesh) return;
  //   const { timeElapsed } = timeSnapshot.context;
  //   const time = timeElapsed * TIME_MULT;
  //   const axialRotation = siderealRotRate * time;
  //   // Rotate the body around its rotational axis.
  //   mesh.rotation.set(PI_OVER_TWO, 0, degToRad(obliquity)); // Reset rotation.
  //   mesh.rotateY(axialRotation); // Rotate around local y-axis.
  // });

  const radius = meanRadius / DIST_MULT;
  return (
    <>
      <Sphere
        rotation={[PI_OVER_TWO, 0, degToRad(obliquity)]}
        // visible={isVisible}
        ref={meshRef}
        args={[radius, 128, 64]}
        onClick={handleClick}
        // onPointerMissed={handleMiss}
        onPointerOver={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshBasicMaterial map={texture} />
        <Poles length={2 * radius} />
        {/* <axesHelper args={[2 * radius]} /> */}

        {/* <Trail target={meshRef} color={'white'} width={150} length={100} /> */}
      </Sphere>
    </>
  );
});
