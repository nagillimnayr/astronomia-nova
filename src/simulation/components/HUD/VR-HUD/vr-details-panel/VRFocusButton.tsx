import { BoxHelper, type Group, type Object3D, type Vector3Tuple } from 'three';
import { depth } from '../vr-hud-constants';
import { Center, Svg, Text, useCursor, useHelper } from '@react-three/drei';
import { ICON_MATERIAL_BASE } from '../vr-ui-materials';
import { useRef, useCallback } from 'react';
import useHover from '@/hooks/useHover';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { VRPanel } from '../vr-ui-components/VRPanel';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type ThreeEvent } from '@react-three/fiber';

type VRFocusButtonProps = {
  width: number;
  position?: Vector3Tuple;
};
export const VRFocusButton = ({ position, width }: VRFocusButtonProps) => {
  const { cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const containerRef = useRef<Group>(null!);

  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      if ('stopPropagation' in event) {
        event.stopPropagation();
        // Stopping propagation will call onPointerLeave, so we need to reset isHovered.
        setHovered(true);
      }
      // Get selected body.
      const { selected } = selectionActor.getSnapshot()!.context;
      if (!selected) {
        // it shouldn't be possible to click the button if nothing is selected. So something has gone wrong.
        const err = 'Error! no body selected. This should not be possible.';
        console.error(err);
        throw new Error(err);
      }
      // Focus camera on selection.
      cameraActor.send({
        type: 'SET_TARGET',
        focusTarget: selected,
      });
    },
    [cameraActor, selectionActor, setHovered]
  );

  // const width = 2;
  const height = width / 2;
  const radius = 0.2 * height;
  const iconSize = 0.02 * height;
  const fontSize = 0.35 * height;

  const textXPos = -0.15 * width;
  const iconXPos = 0.25 * width;
  return (
    <>
      <Interactive
        onSelect={handleClick}
        onHover={hoverEvents.handlePointerEnter}
        onBlur={hoverEvents.handlePointerLeave}
      >
        <group
          ref={containerRef}
          position={position}
          scale={isHovered ? 1.2 : 1}
          onClick={handleClick}
          onPointerEnter={hoverEvents.handlePointerEnter}
          onPointerLeave={hoverEvents.handlePointerLeave}
        >
          <VRPanel width={width} height={height} radius={radius}></VRPanel>

          {/** Text. */}
          <Text
            fontSize={fontSize}
            position={[textXPos, 0, depth.xs]}
            anchorX={'center'}
            anchorY={'middle'}
            textAlign={'center'}
          >
            {'Focus'}
          </Text>

          {/** Icon. */}
          <object3D position={[iconXPos, 0, depth.xs]}>
            <Center>
              <Svg
                src="icons/MdiCameraControl.svg"
                fillMaterial={ICON_MATERIAL_BASE}
                scale={iconSize}
              />
            </Center>
          </object3D>
        </group>
      </Interactive>
    </>
  );
};
