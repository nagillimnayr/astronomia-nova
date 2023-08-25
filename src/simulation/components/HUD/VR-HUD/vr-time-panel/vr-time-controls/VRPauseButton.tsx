import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { colors, depth, text, iconSize } from '../../vr-hud-constants';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Box3,
  BoxHelper,
  Color,
  Group,
  MeshBasicMaterial,
  Object3D,
} from 'three';
import {
  Text,
  Svg,
  useHelper,
  Center,
  Circle,
  useCursor,
} from '@react-three/drei';
import { type Vector3Tuple } from 'three';
import { ICON_MATERIAL_BASE, ICON_MATERIAL_HOVER } from '../../vr-ui-materials';
import { Interactive } from '@react-three/xr';

type VRPauseButtonProps = {
  position?: Vector3Tuple;
};
export const VRPauseButton = ({ position = [0, 0, 0] }: VRPauseButtonProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const isPaused = useSelector(timeActor, (state) => state.matches('paused'));

  const groupRef = useRef<Group>(null!);

  // useHelper(groupRef, BoxHelper);

  const [isHovered, setHovered] = useState<boolean>(false);
  useCursor(isHovered, 'pointer');

  // Events handlers.
  const handlePlay = useCallback(() => {
    timeActor.send({ type: 'UNPAUSE' });
  }, [timeActor]);
  const handlePause = useCallback(() => {
    timeActor.send({ type: 'PAUSE' });
  }, [timeActor]);
  const handleClick = isPaused ? handlePlay : handlePause;

  const handlePointerEnter = useCallback(() => {
    setHovered(true);
  }, []);
  const handlePointerLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const iconSrc = isPaused ? 'icons/MdiPlay.svg' : 'icons/MdiPause.svg';

  const size = iconSize.base;
  return (
    <>
      <Interactive
        onSelect={handleClick}
        onHover={handlePointerEnter}
        onBlur={handlePointerLeave}
      >
        <group
          ref={groupRef}
          position={position}
          scale={isHovered ? 1.2 : 1}
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <Circle args={[1]}>
            <meshBasicMaterial color={'red'} />
            <object3D
              position={[0, 0, depth.xs]}
              scale={size}
              onClick={handleClick}
            >
              <Center>
                <Svg
                  src={iconSrc}
                  fillMaterial={
                    isHovered ? ICON_MATERIAL_HOVER : ICON_MATERIAL_BASE
                  }
                />
              </Center>
            </object3D>
          </Circle>
        </group>
      </Interactive>
    </>
  );
};
