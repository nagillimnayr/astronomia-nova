import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { colors, text, iconSize } from '../../vr-hud-constants';
import { useCallback, useMemo, useState } from 'react';
import {
  Text,
  Svg,
  Center,
  Circle,
  MeshDiscardMaterial,
  useCursor,
} from '@react-three/drei';
import { MeshBasicMaterial, type Vector3Tuple } from 'three';
import { ICON_MATERIAL_BASE, ICON_MATERIAL_HOVER } from '../../vr-ui-materials';
import { Interactive } from '@react-three/xr';

const Z_OFFSET = 1e-2;

type VRAdvanceTimeButtonProps = {
  position?: Vector3Tuple;
  reverse?: boolean;
};
export const VRAdvanceTimeButton = ({
  position = [0, 0, 0],
  reverse,
}: VRAdvanceTimeButtonProps) => {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  // Get focusTarget.
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  const [isHovered, setHovered] = useState<boolean>(false);
  useCursor(isHovered, 'pointer');

  const handleClick = useCallback(() => {
    rootActor.send({ type: 'ADVANCE_DAY', reverse });
  }, [reverse, rootActor]);

  const handlePointerEnter = useCallback(() => {
    setHovered(true);
  }, []);
  const handlePointerLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const iconSrc = reverse
    ? 'icons/MdiWeatherSunsetDown.svg'
    : 'icons/MdiWeatherSunsetUp.svg';

  const size = iconSize.base;
  return (
    <>
      <Interactive
        onSelect={handleClick}
        onHover={handlePointerEnter}
        onBlur={handlePointerLeave}
      >
        <group
          position={position}
          scale={isHovered ? 1.2 : 1}
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <Circle args={[1]}>
            <meshBasicMaterial color={'red'} />
            <object3D position={[0, 0, Z_OFFSET]} scale={size}>
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
