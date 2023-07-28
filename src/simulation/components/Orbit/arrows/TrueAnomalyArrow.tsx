import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type MutableRefObject } from 'react';
import {
  type ArrowHelper,
  type ColorRepresentation,
  type Object3D,
  Vector3,
} from 'three';

type ArrowProps = {
  color: ColorRepresentation;
  target: MutableRefObject<Object3D | null>;
};

export const TrueAnomalyArrow = (props: ArrowProps) => {
  const arrowRef = useRef<ArrowHelper | null>(null);

  useFrame(() => {
    if (!arrowRef.current || !props.target.current) return;
    const arrow = arrowRef.current;

    const diffVec = new Vector3().subVectors(
      props.target.current.position,
      arrow.position
    );

    arrow.setLength(diffVec.length(), 0.5);
    arrow.setDirection(diffVec.normalize());
  });

  return (
    <>
      <arrowHelper
        visible={false}
        ref={(arrow) => {
          if (!arrow) return;
          arrowRef.current = arrow;
          arrow.setLength(1, 0.5);
        }}
        args={[
          new Vector3(1, 0, 0),
          new Vector3(0, 0, 0),
          1,
          props.color,
          0.5,
          0.5,
        ]}
      />
    </>
  );
};
