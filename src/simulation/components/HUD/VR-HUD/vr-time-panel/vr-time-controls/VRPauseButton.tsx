import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { depth, iconSize } from '../../vr-hud-constants';
import { useCallback, useRef, useState } from 'react';
import { BoxHelper, type Group } from 'three';
import {
  Svg,
  Center,
  Circle,
  useCursor,
  Sphere,
  useHelper,
} from '@react-three/drei';
import { type Vector3Tuple } from 'three';
import { ICON_MATERIAL_BASE, ICON_MATERIAL_HOVER } from '../../vr-ui-materials';
import { Interactive } from '@react-three/xr';
import useHover from '@/hooks/useHover';

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
  const handlePlay = useCallback(() => {
    timeActor.send({ type: 'UNPAUSE' });
  }, [timeActor]);
  const handlePause = useCallback(() => {
    timeActor.send({ type: 'PAUSE' });
  }, [timeActor]);
  const handleClick = isPaused ? handlePlay : handlePause;

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
            <object3D
              position={[0, 0, depth.xs]}
              scale={size}
              onClick={handleClick}
            >
              <Center
                disableZ
                onCentered={(props) => {
                  console.log('centered:', props);
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
              {/* <axesHelper args={[10]} /> */}
            </object3D>
          </Circle>
        </group>
      </Interactive>
    </>
  );
};
