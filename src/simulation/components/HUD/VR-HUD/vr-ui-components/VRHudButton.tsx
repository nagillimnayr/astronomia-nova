import useHover from '@/hooks/useHover';
import { type ThreeEvent } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import {
  Box3,
  type Group,
  type Object3D,
  Vector3,
  ColorRepresentation,
} from 'three';
import { AnimatedVRPanel, VRPanel, type VRPanelProps } from './VRPanel';
import { VRLabel } from './VRLabel';
import { Panel } from './classes/Panel';
import { TextMesh } from '@/type-declarations/troika-three-text/Text';
import { Text, useCursor } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { colors, depth } from '../vr-hud-constants';

const HORIZONTAL_RATIO = 2 / 1.6;

type VRHudButtonProps = Omit<VRPanelProps, 'onClick'> & {
  onClick?: (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => void;
  label: string;
  hoverColor?: ColorRepresentation;
};
export const VRHudButton = ({
  onClick,
  width = 2,
  height = 1,
  label,
  position,
  backgroundColor = colors.background,
  hoverColor = colors.gray400,
}: VRHudButtonProps) => {
  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');
  const [spring, springApi] = useSpring(() => ({
    scale: 1,
    backgroundColor: backgroundColor.toString(),
  }));
  const { scale } = useSpring({
    scale: isHovered ? 1.2 : 1,
  });

  useEffect(() => {
    springApi.start({
      scale: isHovered ? 1.2 : 1,
      backgroundColor: isHovered
        ? hoverColor.toString()
        : backgroundColor.toString(),
    });
  });

  const containerRef = useRef<Group>(null!);
  const panelRef = useRef<Panel>(null!);
  const labelRef = useRef<Object3D>(null!);

  return (
    <>
      <animated.group
        ref={containerRef}
        position={position}
        onPointerEnter={hoverEvents.handlePointerEnter}
        onPointerLeave={hoverEvents.handlePointerLeave}
        scale={scale}
      >
        <Interactive
          onSelect={onClick}
          onHover={hoverEvents.handlePointerEnter}
          onBlur={hoverEvents.handlePointerLeave}
        >
          <object3D onClick={onClick}>
            <VRPanel ref={panelRef} width={width} height={height} />
            <AnimatedVRPanel
              ref={panelRef}
              width={width}
              height={height}
              backgroundColor={spring.backgroundColor}
            />
          </object3D>
        </Interactive>

        <object3D ref={labelRef}>
          {/* <VRLabel label={label} fontSize={height * 0.5} onSync={handleSync} /> */}
          <Text
            position-z={depth.xs}
            anchorX={'center'}
            anchorY={'middle'}
            fontSize={height * 0.65}
          >
            {label}
          </Text>
        </object3D>
      </animated.group>
    </>
  );
};
