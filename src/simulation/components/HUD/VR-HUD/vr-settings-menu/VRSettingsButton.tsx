import {
  PropsWithoutRef,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  GOLDEN_RATIO,
  border,
  colors,
  text,
  borderRadius,
} from '../vr-hud-constants';
import {
  Object3D,
  type Vector3Tuple,
  Vector3,
  type Group,
  BoxHelper,
  ColorRepresentation,
  MeshBasicMaterial,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Checkbox, IconButton, Slider } from '@coconut-xr/apfel-kruemel';
import { type ContextFrom } from 'xstate';
import { type visibilityMachine } from '@/state/xstate/visibility-machine/visibility-machine';
import { useSelector } from '@xstate/react';
import {
  Container,
  ContainerProperties,
  ExtendedThreeEvent,
  RootContainer,
  SVG,
  Text,
} from '@coconut-xr/koestlich';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import {
  Center,
  Circle,
  Edges,
  MeshDiscardMaterial,
  Plane,
  Svg,
  useCursor,
} from '@react-three/drei';
import { VRSettingsMenu } from './VRSettingsMenu';
import { useSpring, animated } from '@react-spring/three';
import useHover from '@/hooks/useHover';

type VRSettingsButtonProps = {
  position?: Vector3Tuple;
  size: number;
  debug?: boolean;
};
export const VRSettingsButton = ({
  position,
  size,
  debug = false,
}: VRSettingsButtonProps) => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const vrSettingsMenuActor = useSelector(
    uiActor,
    ({ context }) => context.vrSettingsMenuActor
  );

  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');
  const { scale } = useSpring({ scale: isHovered ? 1.2 : 1 });

  const handleClick = useCallback(() => {
    vrSettingsMenuActor.send({ type: 'TOGGLE' });
  }, [vrSettingsMenuActor]);

  const material = useMemo(() => {
    return new MeshBasicMaterial({ transparent: true, opacity: 0.35 });
  }, []);

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return (
    <>
      <animated.group
        position={position}
        scale={scale}
        onPointerEnter={hoverEvents.handlePointerEnter}
        onPointerLeave={hoverEvents.handlePointerLeave}
      >
        <group scale={size}>
          <Circle scale={10} onClick={handleClick}>
            <MeshDiscardMaterial />
            <Edges visible={debug} scale={1} color={'yellow'} />
          </Circle>
          <Center>
            <Suspense>
              <Svg src={'icons/MdiCog.svg'} fillMaterial={material} />
            </Suspense>
          </Center>
        </group>
      </animated.group>
    </>
  );
};
