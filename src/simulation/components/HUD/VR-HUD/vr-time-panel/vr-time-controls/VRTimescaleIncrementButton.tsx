import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { border, colors, depth, icons, text } from '../../vr-hud-constants';
import { useCallback, useMemo } from 'react';
import { Center, Circle, Svg, Text, useCursor } from '@react-three/drei';
import { type Vector3Tuple } from 'three';
import { ICON_MATERIAL_BASE } from '../../vr-ui-materials';
import useHover from '@/hooks/useHover';
import { Interactive, XRInteractionEvent } from '@react-three/xr';
import { ThreeEvent } from '@react-three/fiber';

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
      decrementTimescale: (
        event: ThreeEvent<MouseEvent> | XRInteractionEvent
      ) => {
        if ('stopPropagation' in event) {
          event.stopPropagation();
          // Stopping propagation will call onPointerLeave, so we need to reset isHovered.
          setHovered(true);
        }
        timeActor.send({ type: 'DECREMENT_TIMESCALE' });
      },
      incrementTimescale: (
        event: ThreeEvent<MouseEvent> | XRInteractionEvent
      ) => {
        if ('stopPropagation' in event) {
          event.stopPropagation();
          // Stopping propagation will call onPointerLeave, so we need to reset isHovered.
          setHovered(true);
        }
        timeActor.send({ type: 'INCREMENT_TIMESCALE' });
      },
    }),
    [setHovered, timeActor]
  );

  const handleClick = reverse
    ? timescaleEvents.decrementTimescale
    : timescaleEvents.incrementTimescale;

  const iconSrc = reverse
    ? 'icons/MdiChevronLeft.svg'
    : 'icons/MdiChevronRight.svg';

  const size = icons.base;
  return (
    <>
      <Interactive
        onSelect={handleClick}
        onHover={hoverEvents.handlePointerEnter}
        onBlur={hoverEvents.handlePointerLeave}
      >
        <group
          scale={isHovered ? 1.2 : 1}
          position={position}
          onClick={handleClick}
          onPointerEnter={hoverEvents.handlePointerEnter}
          onPointerLeave={hoverEvents.handlePointerLeave}
        >
          {/** Circle background. */}
          <Circle
            name="icon-circle"
            args={[1]}
            material-color={colors.icon.bg.base}
          />

          {/** Offset the z position of the icon from its background. */}
          <object3D position={[0, 0, depth.xs]} scale={size}>
            {/** Center the Svg icon. */}
            <Center>
              <Svg
                name="svg-icon"
                src={iconSrc}
                fillMaterial={ICON_MATERIAL_BASE}
              />
            </Center>
          </object3D>
        </group>
      </Interactive>
    </>
  );
};
