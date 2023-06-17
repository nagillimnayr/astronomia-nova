import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import { ColorRepresentation, Vector3 } from 'three';

type ArrowProps = {
  color: ColorRepresentation;
  target: Vector3;
};

export const Arrow = (props: ArrowProps) => {
  const points: Vector3[] = useMemo(
    () => [new Vector3(), props.target.clone()],
    [props.target]
  );
  return (
    <>
      <Line points={points} color={props.color} lineWidth={1} />
    </>
  );
};
