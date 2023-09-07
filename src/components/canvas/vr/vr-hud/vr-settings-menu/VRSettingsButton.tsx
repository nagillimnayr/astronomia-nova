import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  type Group,
  MeshBasicMaterial,
  Vector3,
  type Vector3Tuple,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import {
  Center,
  Circle,
  Edges,
  MeshDiscardMaterial,
  Svg,
  useCursor,
} from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import useHover from '@/hooks/useHover';
import { useThree } from '@react-three/fiber';
import { Interactive } from '@react-three/xr';

const _camWorldPos = new Vector3();

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

  const getThree = useThree(({ get }) => get);

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

  const containerRef = useRef<Group>(null!);

  return (
    <>
      <animated.group
        ref={containerRef}
        position={position}
        scale={scale}
        onPointerEnter={hoverEvents.handlePointerEnter}
        onPointerLeave={hoverEvents.handlePointerLeave}
      >
        <group scale={size}>
          <Interactive
            onSelect={handleClick}
            onHover={hoverEvents.handlePointerEnter}
            onBlur={hoverEvents.handlePointerLeave}
          >
            <Circle scale={10} onClick={handleClick}>
              <MeshDiscardMaterial />
              <Edges visible={debug} scale={1} color={'yellow'} />
            </Circle>
          </Interactive>
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
