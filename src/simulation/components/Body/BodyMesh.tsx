import {
  MeshLineGeometry,
  Trail,
  useCursor,
  useHelper,
} from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import { useRef, useState } from 'react';
import { BoxHelper, ColorRepresentation, Mesh, Object3D, Texture } from 'three';
import { useSnapshot } from 'valtio';
import KeplerBody from '~/simulation/classes/KeplerBody';
import { debugState } from '~/simulation/state/DebugState';
import { simState } from '~/simulation/state/SimState';

// separate out the Mesh part of the Body to keep visual updates separate from
// the simulation logic

type BodyMeshProps = {
  meanRadius: number;
  texture: Texture;
  color: ColorRepresentation;
};

export const BodyMesh = (props: BodyMeshProps) => {
  const meshRef = useRef<Mesh>(null!);
  const trailRef = useRef<MeshLineGeometry>(null!);

  const [isSelected, setSelected] = useState<boolean>(false);
  const [isHovered, setHovered] = useState<boolean>(false);
  useCursor(isHovered, 'pointer');

  // check if we should show bounding boxes
  const debugSnap = useSnapshot(debugState);
  useHelper(debugSnap.showBoundingBoxes ? meshRef : null, BoxHelper, 'cyan');

  // event handlers
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!meshRef.current) {
      return;
    }
    const body: KeplerBody = meshRef.current.parent!.parent as KeplerBody;

    setSelected(true);
    simState.select(body);
  };
  const handleMiss = (e: MouseEvent) => {
    if (!meshRef.current) return;
    if (isSelected) {
      setSelected(false);
    }
  };

  return (
    <>
      <Select enabled={isSelected}>
        <mesh
          ref={meshRef}
          scale={props.meanRadius}
          onClick={handleClick}
          onPointerMissed={handleMiss}
          onPointerOver={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereGeometry />
          <meshBasicMaterial map={props.texture} />
        </mesh>
      </Select>

      <Trail
        ref={trailRef}
        target={meshRef}
        width={1}
        length={300}
        decay={0.001}
        color={props.color}
      />
    </>
  );
};
