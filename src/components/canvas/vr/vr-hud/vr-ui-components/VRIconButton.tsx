import useHover from '@/hooks/useHover';
import { animated, useSpring } from '@react-spring/three';
import { Center, Svg, useCursor } from '@react-three/drei';
import { type ThreeEvent } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { useCallback, useEffect, useRef } from 'react';
import { type Group, type Vector3Tuple } from 'three';
import {
  colors,
  depth,
  icons,
} from '../../../../../constants/vr-hud-constants';
import { ICON_MATERIAL_BASE } from '../../../../../constants/vr-ui-materials';
import { anim } from '../../../animated-components';

const dummyFn = () => {
  return;
};

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
  const [spring, springRef] = useSpring(() => ({
    scale: 1,
    bgColor: colors.icon.bg.base,
  }));
  useEffect(() => {
    springRef.start({
      scale: isHovered ? 1.2 : 1,
      bgColor: isHovered ? colors.icon.bg.hover : colors.icon.bg.base,
    });
  }, [isHovered, springRef]);

  const iconRef = useRef<Group>(null!);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      if ('stopPropagation' in event) {
        event.stopPropagation();
        // Stopping propagation will call onPointerLeave, so we need to reset
        // isHovered.
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
        <animated.group scale={spring.scale}>
          <Interactive
            onSelect={handleClick}
            onHover={hoverEvents.handlePointerEnter}
            onBlur={hoverEvents.handlePointerLeave}
          >
            <anim.Circle
              args={[radius]}
              material-color={spring.bgColor}
              onClick={handleClick}
              onPointerEnter={hoverEvents.handlePointerEnter}
              onPointerLeave={hoverEvents.handlePointerLeave}
            ></anim.Circle>
            <object3D position-z={depth.xxs}>
              <Center disableZ onCentered={dummyFn}>
                <Svg
                  ref={iconRef}
                  src={iconSrc}
                  fillMaterial={ICON_MATERIAL_BASE}
                  scale={iconSize * icons.base * radius}
                />
              </Center>
            </object3D>
          </Interactive>
        </animated.group>
      </group>
    </>
  );
};
