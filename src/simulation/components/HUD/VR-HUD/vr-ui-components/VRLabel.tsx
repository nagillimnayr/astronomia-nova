import {
  Center,
  MeshDiscardMaterial,
  Plane,
  Text,
  useHelper,
} from '@react-three/drei';
import { useLayoutEffect, useRef } from 'react';
import { Box3, BoxHelper, Group, Mesh, Object3D, Vector3 } from 'three';
import { depth } from '../vr-hud-constants';
import useHover from '@/hooks/useHover';

const bbox = new Box3();
const bbSize = new Vector3();
const bbCenter = new Vector3();

const HEIGHT_ADJUST = 4 / 3;

type VRLabelProps = {
  label: string;
  fontSize?: number;
};
export const VRLabel = ({ label, fontSize = 1 }: VRLabelProps) => {
  const { isHovered, setHovered, hoverEvents } = useHover();
  const containerRef = useRef<Group>(null!);
  const textRef = useRef<Object3D>(null!);
  const planeRef = useRef<Mesh>(null!);

  const boxHelper = useHelper(containerRef, BoxHelper);
  // const textHelper = useHelper(textRef, BoxHelper);
  // const boxHelperPlane = useHelper(planeRef, BoxHelper);

  // useLayoutEffect(() => {
  //   const container = containerRef.current;
  //   if (!containerRef) return;

  //   bbox.setFromObject(container);
  //   bbox.getSize(bbSize);
  //   console.log('container bbox size:', bbSize);
  // });

  const adjustedSize = fontSize * HEIGHT_ADJUST;
  return (
    <>
      <group
        ref={containerRef}
        onPointerEnter={hoverEvents.handlePointerEnter}
        onPointerLeave={hoverEvents.handlePointerLeave}
      >
        <Plane
          args={[0.1 * fontSize, fontSize]}
          ref={planeRef}
          position={[0, 0, 0]}
        >
          <MeshDiscardMaterial />
        </Plane>

        <object3D ref={textRef} position={[0, -0.125 * adjustedSize, depth.xs]}>
          <Text lineHeight={0.5} fontSize={adjustedSize}>
            {label}
          </Text>
        </object3D>
      </group>
    </>
  );
};
