import useHover from '@/hooks/useHover';
import { useSpring, animated } from '@react-spring/three';
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

const rotRate = -0.05;

type VRGrabbableProps = {
  position?: Vector3Tuple;
  color?: ColorRepresentation;
};
export const VRGrabbable = ({ position, color }: VRGrabbableProps) => {
  const { isHovered, setHovered, hoverEvents } = useHover();
  const { scale } = useSpring({
    scale: isHovered ? 1.5 : 1,
  });

  const cubeRef = useRef<Mesh>(null!);

  useFrame(({ camera }, delta, frame) => {
    const cube = cubeRef.current;
    cube.rotateX(delta * rotRate);
    cube.rotateY(delta * rotRate);
    cube.rotateZ(delta * rotRate);
  });

  return (
    <>
      <RayGrab
        onHover={hoverEvents.handlePointerEnter}
        onBlur={hoverEvents.handlePointerLeave}
      >
        <animated.object3D
          position={position}
          scale={scale}
          onPointerEnter={hoverEvents.handlePointerEnter}
          onPointerLeave={hoverEvents.handlePointerLeave}
        >
          <Cube ref={cubeRef}>
            <meshStandardMaterial color={color} />
          </Cube>
        </animated.object3D>
      </RayGrab>
    </>
  );
};
