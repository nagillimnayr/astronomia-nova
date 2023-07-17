import {
  Line,
  MeshLineGeometry,
  Sphere,
  Trail,
  Wireframe,
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
import { useSnapshot } from 'valtio';
import KeplerBody from '@/simulation/classes/KeplerBody';
import { debugState } from '@/simulation/state/DebugState';
// import { timeState } from '@/simulation/state/TimeState';
import { useControls } from 'leva';
import Annotation from '../Annotation';
import { useSimStore } from '@/simulation/state/zustand/sim-store';
import { useCameraStore } from '@/simulation/state/zustand/camera-store';
import { useSelectionStore } from '@/simulation/state/zustand/selection-store';

// separate out the Mesh part of the Body to keep visual updates separate from
// the simulation logic

type BodyMeshProps = {
  name: string;
  bodyRef: MutableRefObject<KeplerBody>;
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

  const setFocus = useCameraStore((state) => state.setFocus);
  const select = useSelectionStore((state) => state.select);

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
    if (!meshRef.current || !props.bodyRef.current) {
      return;
    }
    const body: KeplerBody = props.bodyRef.current;

    // setSelected(true);

    // select body
    // useSimStore.getState().select(body);
    select(body);
    // useCameraStore.getState().setFocus(body);
    setFocus(body);
  };
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
      <Select enabled={isSelected}>
        <Sphere
          visible={isVisible}
          ref={(meshObj) => {
            if (!meshObj) return;
            meshRef.current = meshObj;
            //setMesh(meshObj);
          }}
          args={[props.meanRadius]}
          onClick={handleClick}
          onPointerMissed={handleMiss}
          onPointerOver={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshBasicMaterial
            map={props.texture}
            color={!props.texture ? props.color : undefined}
          />
        </Sphere>
      </Select>
    </>
  );
});
