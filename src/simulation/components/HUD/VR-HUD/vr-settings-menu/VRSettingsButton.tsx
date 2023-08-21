import {
  PropsWithoutRef,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  GOLDEN_RATIO,
  border,
  colors,
  text,
  borderRadius,
} from '../vr-hud-constants';
import {
  Object3D,
  type Vector3Tuple,
  Vector3,
  type Group,
  BoxHelper,
  ColorRepresentation,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Checkbox, IconButton, Slider } from '@coconut-xr/apfel-kruemel';
import { type ContextFrom } from 'xstate';
import { type visibilityMachine } from '@/state/xstate/visibility-machine/visibility-machine';
import { useSelector } from '@xstate/react';
import {
  Container,
  ContainerProperties,
  ExtendedThreeEvent,
  RootContainer,
  SVG,
  Text,
} from '@coconut-xr/koestlich';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import { useCursor } from '@react-three/drei';
import { VRSettingsMenu } from './VRSettingsMenu';

type VRSettingsButtonProps = {
  position?: Vector3Tuple;
};
export const VRSettingsButton = ({ position }: VRSettingsButtonProps) => {
  return (
    <>
      <group position={position}>
        <RootContainer
          sizeX={0.25}
          sizeY={0.25}
          display="flex"
          alignItems="center"
          justifyContent="center"
          // border={border.base}
          // borderColor={colors.border}
        >
          <ToggleMenuButton />
        </RootContainer>

        {/* <VRSettingsMenu /> */}
      </group>
    </>
  );
};

const iconSize = 80;
const ToggleMenuButton = () => {
  // Get actor from state machine.
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const vrSettingsMenuActor = useSelector(
    uiActor,
    ({ context }) => context.vrSettingsMenuActor
  );

  const handleClick = useCallback(() => {
    //
    vrSettingsMenuActor.send({ type: 'TOGGLE' });
  }, [vrSettingsMenuActor]);
  return (
    <>
      <IconButton
        onClick={handleClick}
        borderRadius={1000}
        aspectRatio={1}
        width={'100%'}
        height={'100%'}
        padding={text.md}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <SVG
          url="icons/MdiCog.svg"
          opacity={0.5}
          aspectRatio={1}
          width={iconSize}
          height={iconSize}
        />
      </IconButton>
    </>
  );
};
