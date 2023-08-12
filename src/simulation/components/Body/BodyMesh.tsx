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
import { DAY, DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';

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

  useFrame((state, delta) => {
    const timeSnapshot = timeActor.getSnapshot();
    if (!timeSnapshot) return;
    if (timeSnapshot.matches('paused')) return;
    const mesh = meshRef.current;
    if (!mesh) return;
    const scaledDelta = delta * timeSnapshot.context.timescale * DAY;

    // Rotate the body around its rotational axis.
    mesh.rotateY(siderealRotRate * scaledDelta);
  });

  const radius = meanRadius / DIST_MULT;
  return (
    <>
      <Sphere
        rotation={[degToRad(90), 0, degToRad(obliquity)]}
        // visible={isVisible}
        ref={meshRef}
        args={[radius, 128, 64]}
        onClick={handleClick}
        // onPointerMissed={handleMiss}
        onPointerOver={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshBasicMaterial map={texture} />

        {/* <axesHelper args={[2 * (meanRadius / DIST_MULT)]} /> */}

        {/* <Trail target={meshRef} color={'white'} width={150} length={100} /> */}
      </Sphere>
    </>
  );
});
