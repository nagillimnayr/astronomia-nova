import useHover from '@/hooks/useHover';
import { useSpring, animated } from '@react-spring/three';
import { type PropsWithChildren } from 'react';
import { type Vector3Tuple } from 'three';

type SpringObjectProps = PropsWithChildren & {
  position?: Vector3Tuple;
};
export const SpringScaleObject = ({
  children,
  position,
}: SpringObjectProps) => {
  const { isHovered, setHovered, hoverEvents } = useHover();
  const { scale } = useSpring({
    scale: isHovered ? 1.5 : 1,
  });

  return (
    <>
      <group position={position}>
        <animated.group
          onPointerEnter={hoverEvents.handlePointerEnter}
          onPointerLeave={hoverEvents.handlePointerLeave}
          scale={scale}
        >
          {children}
        </animated.group>
      </group>
    </>
  );
};
