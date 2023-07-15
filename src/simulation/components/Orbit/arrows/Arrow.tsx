import { forwardRef, useImperativeHandle, useRef } from 'react';
import { ArrowHelper, ColorRepresentation, Vector3, Vector3Tuple } from 'three';

type ArrowProps = {
  color: ColorRepresentation;
  direction: Vector3;
  origin: Vector3;
};
export const Arrow = forwardRef<ArrowHelper, ArrowProps>(function Arrow(
  props: ArrowProps,
  fwdRef
) {
  const arrowRef = useRef<ArrowHelper>(null!);
  useImperativeHandle(
    fwdRef,
    () => {
      return arrowRef.current;
    },
    [arrowRef]
  );

  return (
    <>
      <arrowHelper
        ref={(arrow) => {
          if (!arrow) return;
          arrowRef.current = arrow;
          arrow.setColor(props.color);
          arrow.position.set(...props.origin.toArray());
          arrow.setDirection(props.direction);
        }}
      />
    </>
  );
});
