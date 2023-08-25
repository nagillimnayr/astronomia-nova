import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { border, colors, depth, iconSize, text } from '../../vr-hud-constants';
import { useCallback, useMemo } from 'react';
import { Center, Circle, Svg, Text, useCursor } from '@react-three/drei';
import { type Vector3Tuple } from 'three';
import { ICON_MATERIAL_BASE } from '../../vr-ui-materials';
import useHover from '@/hooks/useHover';
import { Interactive } from '@react-three/xr';

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

  const timescaleEvents = useMemo(
    () => ({
      decrementTimescale: () => {
        timeActor.send({ type: 'DECREMENT_TIMESCALE' });
      },
      incrementTimescale: () => {
        timeActor.send({ type: 'INCREMENT_TIMESCALE' });
      },
    }),
    [timeActor]
  );
  // const decrementTimescale = useCallback(() => {
  //   timeActor.send({ type: 'DECREMENT_TIMESCALE' });
  // }, [timeActor]);
  // const incrementTimescale = useCallback(() => {
  //   timeActor.send({ type: 'INCREMENT_TIMESCALE' });
  // }, [timeActor]);

  const handleClick = reverse
    ? timescaleEvents.decrementTimescale
    : timescaleEvents.incrementTimescale;

  const iconSrc = reverse
    ? 'icons/MdiChevronLeft.svg'
    : 'icons/MdiChevronRight.svg';

  const size = iconSize.base;
  return (
    <>
      <Interactive
        onSelect={handleClick}
        onHover={hoverEvents.handlePointerEnter}
        onBlur={hoverEvents.handlePointerLeave}
      >
        <Circle
          args={[1]}
          scale={isHovered ? 1.2 : 1}
          position={position}
          onClick={handleClick}
          onPointerEnter={hoverEvents.handlePointerEnter}
          onPointerLeave={hoverEvents.handlePointerLeave}
        >
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
      </Interactive>
    </>
  );
};
