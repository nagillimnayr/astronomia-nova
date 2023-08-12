import { METER } from '@/simulation/utils/constants';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Object3D, Quaternion, Vector3, Vector3Tuple } from 'three';

const _y = new Vector3(0);
const _objWorldPos = new Vector3();
const _parentWorldPos = new Vector3();
const _diff = new Vector3();
const _cross = new Vector3();
const _worldQuaternion = new Quaternion();
const _up = new Vector3();

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
          obj.getWorldPosition(_objWorldPos);
          _y.set(0, 1, 0); // Reset y unit vector.
          // Get y unit vector in world coords. (This will set _y as the object's up vector relative to the world origin. Equivalent to adding the local up vector to the object's world coords.)
          obj.localToWorld(_y);
          // To get the direction of the vector relative to the object, we can subtract the object's world coords.
          _y.sub(_objWorldPos); // We now have the object's up vector in world coords.
          obj.up.copy(_y); // Set the up vector so that it will be properly oriented after rotating it.

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
    </>
  );
};
