import useHover from '@/hooks/useHover';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { animated, useSpring } from '@react-spring/three';
import { Center, Svg, Text, useCursor } from '@react-three/drei';
import { type ThreeEvent } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { useSelector } from '@xstate/react';
import { useCallback, useEffect, useRef } from 'react';
import { type Group, type Vector3Tuple } from 'three';
import { colors, depth } from '@/constants/vr-hud-constants';
import { ICON_MATERIAL_BASE } from '@/constants/vr-ui-materials';
import { VRPanel } from '../vr-ui-components/vr-panel/VRPanel';

type VRSurfaceButtonProps = {
  width: number;
  position?: Vector3Tuple;
};
export const VRSurfaceButton = ({ position, width }: VRSurfaceButtonProps) => {
  const { cameraActor, selectionActor, uiActor, visibilityActor } =
    MachineContext.useSelector(({ context }) => context);

  const vrSurfaceDialogActor = useSelector(
    uiActor,
    ({ context }) => context.vrSurfaceDialogActor
  );
  const trajectories = useSelector(
    visibilityActor,
    ({ context }) => context.trajectories
  );

  const containerRef = useRef<Group>(null!);
  const contentRef = useRef<Group>(null!);

  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');

  const [spring, springApi] = useSpring(() => ({
    scale: 1,
    color: colors.background,
  }));
  useEffect(() => {
    springApi.start({
      scale: isHovered ? 1.2 : 1,
      color: isHovered ? colors.hover : colors.background,
    });
  }, [isHovered, springApi]);

  // Get the currently selected body.
  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

  const inSpace = useSelector(cameraActor, (state) => state.matches('space'));

  // Only open if a body is selected.
  const isOpen = Boolean(selected);

  const handleSurfaceClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      if ('stopPropagation' in event) {
        event.stopPropagation();
        // Stopping propagation will call onPointerLeave, so we need to reset
        // isHovered.
        setHovered(true);
      }
      // Get current selection.
      const { selected } = selectionActor.getSnapshot()!.context;
      if (!selected) {
        // it shouldn't be possible to click the button if nothing is selected.
        // So something has gone wrong.
        const err = 'Error! no body selected. This should not be possible.';
        console.error(err);
        throw new Error(err);
      }

      // Set focus target to selected.
      cameraActor.send({
        type: 'SET_TARGET',
        focusTarget: selected,
      });

      // Open surface dialog.
      vrSurfaceDialogActor.send({ type: 'TOGGLE' });
    },
    [cameraActor, selectionActor, setHovered, vrSurfaceDialogActor]
  );

  const handleSpaceClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      if ('stopPropagation' in event) {
        event.stopPropagation();
        // Stopping propagation will call onPointerLeave, so we need to reset
        // isHovered.
        setHovered(true);
      }
      // Set focus target to selected.
      cameraActor.send({
        type: 'TO_SPACE',
      });
      trajectories.send({ type: 'ENABLE' });
    },
    [cameraActor, setHovered, trajectories]
  );

  const handleClick = inSpace ? handleSurfaceClick : handleSpaceClick;

  // const width = 2;
  const height = width / 2;
  const radius = 0.2 * height;
  const iconSize = 0.015 * height;
  const fontSize = 0.35 * height;

  const textXPos = -0.125 * width;
  const textYPos = -0.025 * height;
  // const textYPos = 0;

  const iconXPos = 0.3 * width;
  // const iconYPos = 0.05 * height;
  const iconYPos = 0;
  // const iconYPos = 0;
  return (
    <>
      <animated.group
        name="vr-surface-button"
        ref={containerRef}
        position={position}
        visible={isOpen}
        scale={spring.scale}
      >
        <group>
          <Interactive
            onSelect={handleClick}
            onHover={hoverEvents.handlePointerEnter}
            onBlur={hoverEvents.handlePointerLeave}
          >
            {/* <VRPanel width={width} height={height} radius={radius}/> */}
            <VRPanel
              width={width}
              height={height}
              radius={radius}
              backgroundColor={spring.color}
              borderWidth={0.05 * height}
              onClick={handleClick}
              onPointerEnter={hoverEvents.handlePointerEnter}
              onPointerLeave={hoverEvents.handlePointerLeave}
            />
          </Interactive>

          <group
            position={[0.05127 * height, -0.008 * height, depth.xxs]}
            ref={contentRef}
          >
            {/** Text. */}
            <Text
              fontSize={fontSize}
              position={[textXPos, textYPos, 0]}
              anchorX={'center'}
              anchorY={'middle'}
              textAlign={'center'}
            >
              {inSpace ? 'Surface' : 'Space'}
            </Text>

            {/** Icon. */}
            <object3D position={[iconXPos, iconYPos, 0]}>
              <Center>
                <Svg
                  src="icons/MdiTelescope.svg"
                  fillMaterial={ICON_MATERIAL_BASE}
                  scale={iconSize}
                />
              </Center>
            </object3D>
          </group>
        </group>
      </animated.group>
    </>
  );
};
