import { Box as Cube } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RayGrab } from '@react-three/xr';
import { useRef } from 'react';
import {
  type ColorRepresentation,
  type Mesh,
  Object3D,
  type Vector3Tuple,
} from 'three';

const rotRate = -1;

type VRGrabbableProps = {
  position?: Vector3Tuple;
  color?: ColorRepresentation;
};
export const VRGrabbable = ({ position, color }: VRGrabbableProps) => {
  const cubeRef = useRef<Mesh>(null!);

  useFrame(({ camera }, delta, frame) => {
    const cube = cubeRef.current;
    cube.rotateX(delta * rotRate);
    cube.rotateY(delta * rotRate);
    cube.rotateZ(delta * rotRate);
  });

  return (
    <>
      <RayGrab>
        <Cube ref={cubeRef} position={position}>
          <meshStandardMaterial color={color} />
        </Cube>
      </RayGrab>
    </>
  );
};
