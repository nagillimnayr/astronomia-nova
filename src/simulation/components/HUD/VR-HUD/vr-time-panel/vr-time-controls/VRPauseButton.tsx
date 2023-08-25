import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { depth, iconSize } from '../../vr-hud-constants';
import { useCallback, useMemo, useRef, useState } from 'react';
import { BoxHelper, type Group } from 'three';
import {
  Svg,
  Center,
  Circle,
  useCursor,
  Sphere,
  useHelper,
  OnCenterCallbackProps,
} from '@react-three/drei';
import { type Vector3Tuple } from 'three';
import { ICON_MATERIAL_BASE, ICON_MATERIAL_HOVER } from '../../vr-ui-materials';
import { Interactive, XRInteractionEvent } from '@react-three/xr';
import useHover from '@/hooks/useHover';
import { ThreeEvent } from '@react-three/fiber';

type VRPauseButtonProps = {
  position?: Vector3Tuple;
};
export const VRPauseButton = ({ position = [0, 0, 0] }: VRPauseButtonProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const isPaused = useSelector(timeActor, (state) => state.matches('paused'));

  const groupRef = useRef<Group>(null!);
  const iconRef = useRef<Group>(null!);

  // useHelper(groupRef, BoxHelper);
  // useHelper(iconRef, BoxHelper, 'blue');

  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');

  // Events handlers.
  const eventHandlers = useMemo(
    () => ({
      unpause: (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
        if ('stopPropagation' in event) {
          event.stopPropagation();
          // Stopping propagation will call onPointerLeave, so we need to reset isHovered.
          setHovered(true);
        }
        timeActor.send({ type: 'UNPAUSE' });
      },
      pause: (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
        if ('stopPropagation' in event) {
          event.stopPropagation();
          // Stopping propagation will call onPointerLeave, so we need to reset isHovered.
          setHovered(true);
        }
        timeActor.send({ type: 'PAUSE' });
      },
    }),
    [setHovered, timeActor]
  );

  const handleClick = isPaused ? eventHandlers.unpause : eventHandlers.pause;

  const iconSrc = isPaused ? 'icons/MdiPlay.svg' : 'icons/MdiPause.svg';

  const size = iconSize.base;
  return (
    <>
      <Interactive
        onSelect={handleClick}
        onHover={hoverEvents.handlePointerEnter}
        onBlur={hoverEvents.handlePointerLeave}
      >
        <group
          ref={groupRef}
          position={position}
          scale={isHovered ? 1.2 : 1}
          onClick={handleClick}
          onPointerEnter={hoverEvents.handlePointerEnter}
          onPointerLeave={hoverEvents.handlePointerLeave}
        >
          <Circle args={[1]}>
            <meshBasicMaterial color={'red'} />
            <Center
              disableZ
              position={[0, 0, depth.xs]}
              scale={size}
              onCentered={(props) => {
                // This is just to force the Center component to re-center each time the component is re-rendered.
                // console.log('centered', props);
              }}
            >
              <Svg
                ref={iconRef}
                src={iconSrc}
                fillMaterial={
                  isHovered ? ICON_MATERIAL_HOVER : ICON_MATERIAL_BASE
                }
              />
            </Center>
            {/* <Sphere args={[0.5]} material-color={'blue'} /> */}
          </Circle>
        </group>
      </Interactive>
    </>
  );
};
