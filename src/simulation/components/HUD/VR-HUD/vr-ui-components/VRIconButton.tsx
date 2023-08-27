import useHover from '@/hooks/useHover';
import { type ThreeEvent } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { Center, Circle, Svg, useCursor } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { type Group, type Vector3Tuple } from 'three';
import { useCallback, useRef } from 'react';
import { colors, depth, icons } from '../vr-hud-constants';
import { ICON_MATERIAL_BASE } from '../vr-ui-materials';

type VRIconButtonProps = {
  position?: Vector3Tuple;
  radius?: number;
  iconSize?: number;
  iconSrc: string;
  onClick?: (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => void;
};

export const VRIconButton = ({
  position = [0, 0, 0],
  radius = 1,
  iconSize = 1,
  iconSrc,
  onClick,
}: VRIconButtonProps) => {
  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');
  const { scale } = useSpring({
    scale: isHovered ? 1.2 : 1,
  });

  const iconRef = useRef<Group>(null!);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      if ('stopPropagation' in event) {
        event.stopPropagation();
        // Stopping propagation will call onPointerLeave, so we need to reset isHovered.
        setHovered(true);
      }
      if (onClick) {
        onClick(event);
      }
    },
    [onClick, setHovered]
  );

  return (
    <>
      <group position={position}>
        <animated.group
          scale={scale}
          onClick={handleClick}
          onPointerEnter={hoverEvents.handlePointerEnter}
          onPointerLeave={hoverEvents.handlePointerLeave}
        >
          <Interactive
            onSelect={handleClick}
            onHover={hoverEvents.handlePointerEnter}
            onBlur={hoverEvents.handlePointerLeave}
          >
            <Circle args={[radius]} material-color={colors.icon.bg.base}>
              <Center
                disableZ
                position={[0, 0, depth.xs]}
                onCentered={(props) => {
                  // This is just to force the Center component to re-center each time the component is re-rendered.
                  // console.log('centered', props);
                }}
              >
                <Svg
                  ref={iconRef}
                  src={iconSrc}
                  fillMaterial={ICON_MATERIAL_BASE}
                  scale={iconSize * icons.base * radius}
                />
              </Center>
            </Circle>
          </Interactive>
        </animated.group>
      </group>
    </>
  );
};
