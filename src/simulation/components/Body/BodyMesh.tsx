import {
  Line,
  MeshLineGeometry,
  Trail,
  useCursor,
  useHelper,
  useTexture,
  useTrail,
} from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import {
  MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import KeplerBody from '@/simulation/classes/KeplerBody';
import { camState } from '@/simulation/state/CamState';
import { debugState } from '@/simulation/state/DebugState';
import { selectState } from '@/simulation/state/SelectState';
import { simState } from '@/simulation/state/SimState';
import { timeState } from '@/simulation/state/TimeState';
import { useControls } from 'leva';
import Annotation from '../Annotation';

// separate out the Mesh part of the Body to keep visual updates separate from
// the simulation logic

type BodyMeshProps = {
  name: string;
  body: MutableRefObject<KeplerBody>;
  meanRadius: number;
  texture?: Texture;
  color: ColorRepresentation;
};

export const BodyMesh = forwardRef<Mesh, BodyMeshProps>(function BodyMesh(
  props: BodyMeshProps,
  fwdRef
) {
  const meshRef = useRef<Mesh>(null!);

  const [isVisible, setVisible] = useState<boolean>(true);
  const trailRef = useRef<Line2>(null!);

  // const texture = useTexture(props.texturePath ?? '');

  // const [controls, set] = useControls(props.name, () => ({
  //   select: { value: false },
  //   name: {
  //     value: props.name,
  //     editable: false,
  //   },
  //   visible: {
  //     value: isVisible,
  //     onChange: (vis: boolean) => {
  //       setVisible(vis);
  //     },
  //   },
  // }));

  const [isSelected, setSelected] = useState<boolean>(false);
  const [isHovered, setHovered] = useState<boolean>(false);
  //const [isTrailVisible, setTrailVisibility] = useState<boolean>(false);
  useCursor(isHovered, 'pointer');

  // check if we should show bounding boxes
  const debugSnap = useSnapshot(debugState);
  useHelper(debugSnap.boundingBoxes ? meshRef : null, BoxHelper, 'cyan');

  // event handlers
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!meshRef.current || !props.body.current) {
      return;
    }
    const body: KeplerBody = props.body.current;

    camState.setFocus(body);
    setSelected(true);
    selectState.select(body);
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

  // Set forwarded ref
  // the return value of the callback function will be assigned to fwdRef
  useImperativeHandle(
    fwdRef,
    () => {
      return meshRef.current;
    },
    [meshRef]
  );

  useFrame(() => {
    if (!meshRef.current || !props.body.current) {
      return;
    }
    if (!timeState.isPaused && isSelected) {
      // console.log({
      //   name: props.name,
      //   bodyPosition: props.body.current.position,
      //   meshPosition: meshRef.current.position,
      // });
    }
    meshRef.current.position.set(...props.body.current.position.toArray());
  });

  return (
    <>
      <Select enabled={isSelected}>
        <mesh
          visible={isVisible}
          ref={(meshObj) => {
            if (!meshObj) return;
            meshRef.current = meshObj;
            //setMesh(meshObj);
          }}
          scale={props.meanRadius}
          onClick={handleClick}
          onPointerMissed={handleMiss}
          onPointerOver={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereGeometry />
          <meshBasicMaterial
            map={props.texture}
            color={!props.texture ? props.color : undefined}
          />

          <Annotation annotation={props.name} />
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
});
