import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { border, colors, depth, iconSize, text } from '../../vr-hud-constants';
import { useCallback } from 'react';
import { Center, Circle, Svg, Text, useCursor } from '@react-three/drei';
import { type Vector3Tuple } from 'three';
import { ICON_MATERIAL_BASE } from '../../vr-ui-materials';
import useHover from '@/hooks/useHover';

interface VRTimescaleIncrementButtonProps {
  position?: Vector3Tuple;
  reverse?: boolean;
}
export const VRTimescaleIncrementButton = ({
  position,
  reverse,
}: VRTimescaleIncrementButtonProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');

  const decrementTimescale = useCallback(() => {
    timeActor.send({ type: 'DECREMENT_TIMESCALE' });
  }, [timeActor]);
  const incrementTimescale = useCallback(() => {
    timeActor.send({ type: 'INCREMENT_TIMESCALE' });
  }, [timeActor]);

  const handleClick = reverse ? decrementTimescale : incrementTimescale;

  const iconSrc = reverse
    ? 'icons/MdiChevronLeft.svg'
    : 'icons/MdiChevronRight.svg';

  const size = iconSize.base;
  return (
    <>
      <Circle args={[1]} position={position} onClick={handleClick}>
        <meshBasicMaterial color={colors.background} />
        {/** Offset the z position of the icon from its background. */}
        <object3D
          position={[0, 0, depth.xs]}
          scale={size}
          onClick={handleClick}
        >
          {/** Center the Svg icon. */}
          <Center>
            <Svg src={iconSrc} fillMaterial={ICON_MATERIAL_BASE} />
          </Center>
        </object3D>
      </Circle>
    </>
  );
};
