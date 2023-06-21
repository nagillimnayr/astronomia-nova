import {
  Line,
  MeshLineGeometry,
  Trail,
  useCursor,
  useHelper,
  useTrail,
} from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import { useMemo, useRef, useState } from 'react';
import {
  BoxHelper,
  ColorRepresentation,
  Mesh,
  Object3D,
  Texture,
  Vector3,
} from 'three';
import { Line2 } from 'three-stdlib';
import { useSnapshot } from 'valtio';
import KeplerBody from '~/simulation/classes/KeplerBody';
import { camState } from '~/simulation/state/CamState';
import { debugState } from '~/simulation/state/DebugState';
import { simState } from '~/simulation/state/SimState';
import { timeState } from '~/simulation/state/TimeState';

// separate out the Mesh part of the Body to keep visual updates separate from
// the simulation logic

type BodyMeshProps = {
  meanRadius: number;
  texture: Texture;
  color: ColorRepresentation;
};

export const BodyMesh = (props: BodyMeshProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [mesh, setMesh] = useState<Mesh>(null!);
  const trailRef = useRef<MeshLineGeometry>(null!);
  const lineRef = useRef<Line2>(null!);

  const [isSelected, setSelected] = useState<boolean>(false);
  const [isHovered, setHovered] = useState<boolean>(false);
  //const [isTrailVisible, setTrailVisibility] = useState<boolean>(false);
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

    camState.focusTarget = meshRef.current;
    setSelected(true);
    simState.select(body);
  };
  const handleMiss = (e: MouseEvent) => {
    if (!meshRef.current) return;
    if (isSelected) {
      setSelected(false);
    }
  };

  // const trailPoints = useTrail(mesh, {
  //   length: 300,
  //   decay: 0.01,
  //   local: true,
  // });

  // useFrame(() => {
  //   if (timeState.isPaused || !lineRef.current || !trailPoints.current) return;
  //   lineRef.current.geometry.setPositions(trailPoints.current);
  // });

  return (
    <>
      <Select enabled={isSelected}>
        <mesh
          ref={(meshObj) => {
            if (!meshObj) return;
            meshRef.current = meshObj;
            setMesh(meshObj);
          }}
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

      {/* <Line ref={lineRef} points={[300]} color={props.color} /> */}
      {/* <Trail
        ref={trailRef}
        target={meshRef}
        width={1}
        length={100}
        decay={0.001}
        color={props.color}
        attenuation={(t: number) => {
          return t * t;
        }}
      /> */}
    </>
  );
};
