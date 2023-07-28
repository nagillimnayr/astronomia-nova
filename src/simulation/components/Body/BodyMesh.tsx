import { Sphere, Trail, useCursor, useHelper } from '@react-three/drei';
import { type ThreeEvent } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import {
  type MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useContext,
  useCallback,
} from 'react';
import {
  BoxHelper,
  type ColorRepresentation,
  type Mesh,
  type Texture,
} from 'three';
import type KeplerBody from '@/simulation/classes/KeplerBody';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import Annotation from '../Annotation';
import { BillboardCircle } from '../BillboardCircle';
import { degToRad } from 'three/src/math/MathUtils';
import { CoordinateSphere } from './CoordinateSphere';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';

// Separate out the visual logic from the simulation logic.

type BodyMeshProps = {
  name: string;
  bodyRef: MutableRefObject<KeplerBody>;
  meanRadius: number;
  texture?: Texture;
  color: ColorRepresentation;
};

export const BodyMesh = forwardRef<Mesh, BodyMeshProps>(function BodyMesh(
  { name, bodyRef, meanRadius, texture, color }: BodyMeshProps,
  fwdRef
) {
  const { uiState } = useContext(RootStoreContext);

  const meshRef = useRef<Mesh>(null!);

  const [isVisible, setVisible] = useState<boolean>(true);

  const [isSelected, setSelected] = useState<boolean>(false);
  const [isHovered, setHovered] = useState<boolean>(false);
  //const [isTrailVisible, setTrailVisibility] = useState<boolean>(false);
  useCursor(isHovered, 'pointer');

  // check if we should show bounding boxes
  // useHelper(debugSnap.boundingBoxes ? meshRef : null, BoxHelper, 'cyan');

  // event handlers
  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (!meshRef.current || !bodyRef.current) {
        return;
      }
      const body: KeplerBody = bodyRef.current;
      // select body
      uiState.select(body);
    },
    [bodyRef, uiState]
  );
  const handleMiss = (e: MouseEvent) => {
    if (!meshRef.current) return;
    if (isSelected) {
      setSelected(false);
    }
  };

  // Set forwarded ref
  // the return value of the callback function will be assigned to fwdRef
  useImperativeHandle(
    fwdRef,
    () => {
      return meshRef.current;
    },
    [meshRef]
  );

  return (
    <>
      {/* <Select enabled={isSelected}> */}
      <Sphere
        rotation={[degToRad(90), 0, 0]}
        visible={isVisible}
        ref={meshRef}
        args={[meanRadius / EARTH_RADIUS]}
        onClick={handleClick}
        onPointerMissed={handleMiss}
        onPointerOver={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshBasicMaterial map={texture} color={color} />

        <BillboardCircle bodyRef={bodyRef} />

        <object3D position={[0, -(meanRadius / EARTH_RADIUS) * 1.5, 0]}>
          <Annotation annotation={name} />
        </object3D>
        {/* <CoordinateSphere
          bodyRef={bodyRef}
          radius={meanRadius / EARTH_RADIUS}
        /> */}

        {/* <Trail target={meshRef} color={'white'} width={150} length={100} /> */}
      </Sphere>
      {/* </Select> */}
    </>
  );
});
