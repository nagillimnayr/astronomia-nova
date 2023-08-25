import {
  type ComponentPropsWithoutRef,
  Suspense,
  useCallback,
  useState,
  PropsWithChildren,
  useRef,
  PropsWithoutRef,
} from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  colors,
  text,
} from '../vr-hud-constants';
import {
  Mesh,
  type ColorRepresentation,
  BoxHelper,
  Vector3Tuple,
  Group,
} from 'three';
import { RoundedBox, useCursor, useHelper } from '@react-three/drei';
import { useFlexSize } from '@react-three/flex';
import { ThreeEvent } from '@react-three/fiber';
import { VRPanel } from './VRPanel';
import useHover from '@/hooks/useHover';
import { Button } from '@coconut-xr/apfel-kruemel';

type VRHudButtonProps = ComponentPropsWithoutRef<typeof Button>;
//   & {
//   onClick?: (event: ThreeEvent<MouseEvent>) => void;
// };

export const VRButton = ({ children, ...props }: VRHudButtonProps) => {
  const { isHovered, setHovered, hoverEvents: hoverProps } = useHover();

  useCursor(isHovered, 'pointer');

  const btnRef = useRef<Group>(null!);

  return <></>;
};
{
  /* <VRPanel
  // ref={ref}
  width={btnWidth}
  height={btnHeight}
  borderRadius={radius}
  borderWidth={borderWidth}
  onPointerEnter={handleStartHover}
  onPointerLeave={handleEndHover}
  onClick={onClick}
  backgroundColor={isHovered ? hoverColor : backgroundColor}
  borderColor={isHovered ? borderHoverColor : borderColor}
>
  {/* <meshBasicMaterial color={isHovered ? hoverColor : backgroundColor} /> */
}
// </VRPanel>; */}
