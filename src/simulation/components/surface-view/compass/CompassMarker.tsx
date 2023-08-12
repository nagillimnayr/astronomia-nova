import { METER } from '@/simulation/utils/constants';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { Line, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Object3D, Quaternion, Vector3, Vector3Tuple } from 'three';

const _up = new Vector3();
const _objWorldPos = new Vector3();
const _parentWorldPos = new Vector3();
const _center: Vector3Tuple = [0, 0, 0];

type Props = {
  children: string;
  position: Vector3Tuple;
};
export const CompassMarker = ({ children, position }: Props) => {
  const objRef = useRef<Object3D>(null!);
  // useFrame(({ camera }) => {
  //   const obj = objRef.current;
  //   // Rotate to look at camera.
  //   camera.getWorldPosition(_camWorldPos);
  //   obj.lookAt(_camWorldPos);
  // });
  return (
    <>
      <object3D
        ref={(obj) => {
          if (!obj) return;

          objRef.current = obj;

          const parent = obj.parent;
          if (!parent) return;

          // Get the object's up vector in world coords.
          obj.up.set(...getLocalUpInWorldCoords(obj)); // Set the up vector so that it will be properly oriented after rotating it.

          // Rotate object to face its parent's origin.
          parent.getWorldPosition(_parentWorldPos);
          obj.lookAt(_parentWorldPos);
        }}
        position={position}
      >
        <Text
          fontSize={METER}
          color={'white'}
          anchorX={'center'}
          anchorY={'middle'}
        >
          {children}
        </Text>
        <axesHelper args={[METER]} />
      </object3D>
      <Line points={[_center, position]} />
    </>
  );
};
