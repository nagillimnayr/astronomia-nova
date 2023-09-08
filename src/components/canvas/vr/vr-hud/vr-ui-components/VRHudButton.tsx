import { animated, useSpring } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { type ThreeEvent } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { useCallback, useRef } from 'react';
import { ColorRepresentation, type Group, type Object3D } from 'three';
import { colors, depth } from '../../../../../constants/vr-hud-constants';
import { VRPanel, type VRPanelProps } from './vr-panel/VRPanel';

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
  hoverColor = colors.hover,
}: VRHudButtonProps) => {
  const [spring, springRef] = useSpring(() => ({
    scale: 1,
    backgroundColor: backgroundColor.toString(),
  }));

  const handlePointerEnter = useCallback(() => {
    springRef.start({
      scale: 1.2,
      backgroundColor: hoverColor.toString(),
    });
  }, [hoverColor, springRef]);
  const handlePointerLeave = useCallback(() => {
    springRef.start({
      scale: 1,
      backgroundColor: backgroundColor.toString(),
    });
  }, [backgroundColor, springRef]);

  const containerRef = useRef<Group>(null!);
  const labelRef = useRef<Object3D>(null!);

  return (
    <>
      <animated.group
        ref={containerRef}
        position={position}
        scale={spring.scale}
      >
        <Interactive
          onSelect={onClick}
          onHover={handlePointerEnter}
          onBlur={handlePointerLeave}
        >
          <object3D>
            <VRPanel
              width={width}
              height={height}
              backgroundColor={spring.backgroundColor}
              onClick={onClick}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
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