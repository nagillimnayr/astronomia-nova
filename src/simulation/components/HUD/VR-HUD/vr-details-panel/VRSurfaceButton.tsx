import {
  BoxHelper,
  Mesh,
  type Group,
  type Object3D,
  type Vector3Tuple,
  Box3,
  Vector3,
} from 'three';
import { depth } from '../vr-hud-constants';
import {
  Box,
  Center,
  MeshDiscardMaterial,
  Svg,
  Text,
  Wireframe,
  useCursor,
  useHelper,
} from '@react-three/drei';
import { ICON_MATERIAL_BASE } from '../vr-ui-materials';
import { useRef, useCallback, useMemo } from 'react';
import useHover from '@/hooks/useHover';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { VRPanel } from '../vr-ui-components/VRPanel';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type ThreeEvent } from '@react-three/fiber';

const boundingBox = new Box3();
const bbSize = new Vector3();
const bbCenter = new Vector3();

type VRSurfaceButtonProps = {
  width: number;
  position?: Vector3Tuple;
};
export const VRSurfaceButton = ({ position, width }: VRSurfaceButtonProps) => {
  const { cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const containerRef = useRef<Group>(null!);
  const contentRef = useRef<Group>(null!);
  // useHelper(contentRef, BoxHelper);

  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      if ('stopPropagation' in event) {
        event.stopPropagation();
        // Stopping propagation will call onPointerLeave, so we need to reset isHovered.
        setHovered(true);
      }
      // Get current selection.
      const { selected } = selectionActor.getSnapshot()!.context;
      // Set focus target to selected.
      cameraActor.send({
        type: 'SET_TARGET',
        focusTarget: selected,
      });

      // Transition to surface.
      cameraActor.send({
        type: 'TO_SURFACE',
      });
    },
    [cameraActor, selectionActor, setHovered]
  );

  // const width = 2;
  const height = width / 2;
  const radius = 0.2 * height;
  const iconSize = 0.015 * height;
  const fontSize = 0.35 * height;

  const textXPos = -0.125 * width;
  // const textYPos = -0.05 * height;
  const textYPos = 0;

  const iconXPos = 0.3 * width;
  const iconYPos = 0.05 * height;
  // const iconYPos = 0;
  return (
    <>
      <Interactive
        onSelect={handleClick}
        onHover={hoverEvents.handlePointerEnter}
        onBlur={hoverEvents.handlePointerLeave}
      >
        <group
          name="vr-surface-button"
          ref={containerRef}
          position={position}
          scale={isHovered ? 1.2 : 1}
          onClick={handleClick}
          onPointerEnter={hoverEvents.handlePointerEnter}
          onPointerLeave={hoverEvents.handlePointerLeave}
        >
          <VRPanel width={width} height={height} radius={radius}></VRPanel>

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
              {'Surface'}
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
      </Interactive>
    </>
  );
};
