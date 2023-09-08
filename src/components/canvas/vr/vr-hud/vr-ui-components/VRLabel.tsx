import { TextMesh } from '@/type-declarations/troika-three-text/Text';
import { Edges, MeshDiscardMaterial, Plane, Text } from '@react-three/drei';
// import useHover from '@/hooks/useHover';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Box3, Group, Mesh, Object3D, Vector3, Vector3Tuple } from 'three';
import { depth } from '../../../../../constants/vr-hud-constants';

const bbox = new Box3();
const bbSize = new Vector3();
const bbCenter = new Vector3();

const HEIGHT_ADJUST = 4 / 3;

type VRLabelProps = {
  position?: Vector3Tuple;
  label: string;
  fontSize?: number;
  onSync?: (troika: TextMesh) => void;
  debug?: boolean;
  anchorX?: number | 'center' | 'left' | 'right';
  anchorY?:
    | number
    | 'bottom'
    | 'top'
    | 'middle'
    | 'top-baseline'
    | 'bottom-baseline';
};
export const VRLabel = forwardRef<TextMesh, VRLabelProps>(function VRLabel(
  {
    position,
    label,
    fontSize = 1,
    onSync,
    debug = false,
    anchorX,
    anchorY,
  }: VRLabelProps,
  fwdRef
) {
  const containerRef = useRef<Group>(null!);
  const textRef = useRef<Object3D>(null!);
  const troikaRef = useRef<TextMesh>(null!);
  const planeRef = useRef<Mesh>(null!);

  useImperativeHandle(fwdRef, () => troikaRef.current);

  const adjustedSize = fontSize * HEIGHT_ADJUST;
  return (
    <>
      <group ref={containerRef} position={position}>
        {/** Invisible Plane Mesh to Increase the height of the bounding box so that it is flush with the top of the text. */}
        <Plane
          args={[0.1 * fontSize, fontSize]}
          ref={planeRef}
          position={[0, 0, 0]}
        >
          <MeshDiscardMaterial />
          <Edges visible={debug} scale={1} color={'yellow'} />
        </Plane>

        <object3D
          ref={textRef}
          position={[0, -0.125 * adjustedSize, depth.xs]} // Move the text down
          // slightly to center
          // the bounding box.
        >
          <Text
            ref={troikaRef}
            lineHeight={0.5} // Adjust bounds so that lower bound is flush with
            // bottom of text.
            fontSize={adjustedSize}
            onSync={onSync}
            anchorX={anchorX}
            anchorY={anchorY}
            outlineColor={'black'}
          >
            {label}
          </Text>
        </object3D>
      </group>
    </>
  );
});