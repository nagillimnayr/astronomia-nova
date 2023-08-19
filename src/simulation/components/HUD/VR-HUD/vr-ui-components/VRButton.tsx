import {
  type ComponentPropsWithoutRef,
  Suspense,
  useCallback,
  useState,
  PropsWithChildren,
  useRef,
} from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  colors,
  text,
} from '../vr-hud-constants';
import { Mesh, type ColorRepresentation, BoxHelper, Vector3Tuple } from 'three';
import { RoundedBox, useHelper } from '@react-three/drei';
import { useFlexSize } from '@react-three/flex';
import { ThreeEvent } from '@react-three/fiber';
import { VRPanel } from './VRPanel';

type VRButtonProps = PropsWithChildren & {
  backgroundColor?: ColorRepresentation;
  hoverColor?: ColorRepresentation;
  borderColor?: ColorRepresentation;
  borderHoverColor?: ColorRepresentation;
  position?: Vector3Tuple;
  width?: number;
  height?: number;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
};

export const VRButton = ({
  children,
  backgroundColor = colors.background,
  hoverColor = colors.gray300,
  borderColor,
  borderHoverColor,
  position = [0, 0, 0],
  width,
  height,
  onClick,
}: VRButtonProps) => {
  // const [boxWidth, boxHeight] = useFlexSize();
  const [isHovered, setHovered] = useState(false);

  const handleStartHover = useCallback(() => {
    setHovered(true);
  }, []);

  const handleEndHover = useCallback(() => {
    setHovered(false);
  }, []);

  const ref = useRef<Mesh>(null!);
  useHelper(ref, BoxHelper);
  // console.log('width:', boxWidth);
  // console.log('height:', boxHeight);
  // const width = Boolean(boxWidth) ? boxWidth : 1;
  // const height = Boolean(boxHeight) ? boxHeight : 1;
  const btnHeight = height ?? 1 * GOLDEN_RATIO;
  const btnWidth = width ?? btnHeight * GOLDEN_RATIO;
  const radius = Math.min(btnWidth, btnHeight) * 0.3;

  borderColor = borderColor ?? backgroundColor;
  borderHoverColor = borderHoverColor ?? hoverColor;
  return (
    <>
      <group position={position}>
        <VRPanel
          // ref={ref}
          width={btnWidth}
          height={btnHeight}
          borderRadius={radius}
          borderWidth={0.015}
          onPointerEnter={handleStartHover}
          onPointerLeave={handleEndHover}
          onClick={onClick}
          backgroundColor={isHovered ? hoverColor : backgroundColor}
          borderColor={isHovered ? borderHoverColor : borderColor}
        >
          {/* <meshBasicMaterial color={isHovered ? hoverColor : backgroundColor} /> */}
        </VRPanel>
        <group>{children}</group>
      </group>
    </>
  );
};
