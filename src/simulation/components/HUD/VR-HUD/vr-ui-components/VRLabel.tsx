import {
  MeshDiscardMaterial,
  Plane,
  Text,
  useHelper,
  // useHelper,
} from '@react-three/drei';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import {
  Box3,
  BoxHelper,
  Group,
  Mesh,
  Object3D,
  Vector3,
  Vector3Tuple,
} from 'three';
import { depth } from '../vr-hud-constants';
// import useHover from '@/hooks/useHover';
import React from 'react';
import { TextMesh } from '@/type-declarations/troika-three-text/Text';

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

  const boxHelper = useHelper(containerRef, BoxHelper);

  useEffect(() => {
    if (boxHelper.current) {
      boxHelper.current.visible = debug;
    }
  }, [boxHelper, debug]);

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
        </Plane>

        <object3D
          ref={textRef}
          position={[0, -0.125 * adjustedSize, depth.xs]} // Move the text down slightly to center the bounding box.
        >
          <Text
            ref={troikaRef}
            lineHeight={0.5} // Adjust bounds so that lower bound is flush with bottom of text.
            fontSize={adjustedSize}
            onSync={onSync}
            anchorX={anchorX}
            anchorY={anchorY}
          >
            {label}
          </Text>
        </object3D>
      </group>
    </>
  );
});
