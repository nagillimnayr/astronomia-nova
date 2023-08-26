import {
  MeshDiscardMaterial,
  Plane,
  Text,
  // useHelper,
} from '@react-three/drei';
import { useRef } from 'react';
import { Box3, BoxHelper, Group, Mesh, Object3D, Vector3 } from 'three';
import { depth } from '../vr-hud-constants';
// import useHover from '@/hooks/useHover';
import React from 'react';
import { TextMesh } from '@/type-declarations/troika-three-text/Text';

const bbox = new Box3();
const bbSize = new Vector3();
const bbCenter = new Vector3();

const HEIGHT_ADJUST = 4 / 3;

type VRLabelProps = {
  label: string;
  fontSize?: number;
  onSync?: (troika: TextMesh) => void;
};
export const VRLabel = React.memo(function VRLabel({
  label,
  fontSize = 1,
  onSync,
}: VRLabelProps) {
  // const { isHovered, setHovered, hoverEvents } = useHover();
  const containerRef = useRef<Group>(null!);
  const textRef = useRef<Object3D>(null!);
  const planeRef = useRef<Mesh>(null!);

  // const boxHelper = useHelper(containerRef, BoxHelper);

  const adjustedSize = fontSize * HEIGHT_ADJUST;
  return (
    <>
      <group
        ref={containerRef}
        // onPointerEnter={hoverEvents.handlePointerEnter}
        // onPointerLeave={hoverEvents.handlePointerLeave}
      >
        {/** Invisible Plane Mesh to Increase the height of the bounding box so that it is flush with the top of the text. */}
        <Plane
          args={[0.1 * fontSize, fontSize]}
          ref={planeRef}
          position={[0, 0, 0]}
        >
          <MeshDiscardMaterial />
        </Plane>

        <object3D
          ref={textRef}
          position={[0, -0.125 * adjustedSize, depth.xs]} // Move the text down slightly to center the bounding box.
        >
          <Text
            lineHeight={0.5} // Adjust bounds so that lower bound is flush with bottom of text.
            fontSize={adjustedSize}
            onSync={onSync}
          >
            {label}
          </Text>
        </object3D>
      </group>
    </>
  );
});
