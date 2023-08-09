import { Box } from '@react-three/drei';
import { Object3DProps, useFrame } from '@react-three/fiber';
import { PropsWithChildren, useRef } from 'react';
import { ColorRepresentation, Mesh, Object3D } from 'three';

const rotRate = 1;

type Props = Object3DProps;
export const RotatingObject = ({ children, ...props }: Props) => {
  const ref = useRef<Object3D>(null!);

  useFrame((state, delta, frame) => {
    const obj = ref.current;
    obj.rotateX(delta * rotRate);
    obj.rotateY(delta * rotRate);
    obj.rotateZ(delta * rotRate);
  });
  return (
    <>
      <object3D ref={ref} {...props}>
        {children}
      </object3D>
    </>
  );
};
