import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
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
  ExtendedThreeEvent,
  RootContainer,
  SVG,
  Text,
} from '@coconut-xr/koestlich';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import { capitalize } from 'lodash';
import { useCursor } from '@react-three/drei';
import { celestialSphereMachine } from '@/state/xstate/visibility-machine/celestial-sphere-machine';

type VRSettingsMenuProps = {
  position?: Vector3Tuple;
};
export const VRSettingsMenu = ({
  position = [0, 0, 0],
}: VRSettingsMenuProps) => {
  const width = 1;
  const height = width * GOLDEN_RATIO;
  return (
    <>
      <group position={position}>
        <RootContainer
          sizeX={width}
          sizeY={height}
          borderRadius={border.base}
          flexDirection="column"
        >
          <Container
            padding={text.base}
            borderRadius={borderRadius.base}
            border={border.base}
            borderColor={colors.border}
            backgroundColor={colors.background}
            height={'100%'}
            flexDirection="column"
            alignItems="stretch"
            justifyContent="flex-start"
          >
            <Header />

            <VRSeparator color={colors.border} />

            {/** Toggle Buttons. */}
            <Container
              flexDirection="column"
              alignItems="stretch"
              justifyContent="flex-start"
              paddingY={text.sm}
              gapRow={text.sm}
            >
              {/** Trajectories. */}
              <VRToggleButton
                label={'Trajectories'}
                target="trajectories"
                iconUrl="icons/MdiOrbit.svg"
                defaultSelected
              />
              {/** Annotations. */}
              <VRToggleButton
                label={'Annotations'}
                target={'annotations'}
                iconUrl={'icons/MdiTagText.svg'}
                defaultSelected
              />
              {/** Markers. */}
              <VRToggleButton
                label={'Markers'}
                target={'markers'}
                iconUrl={'icons/MdiTarget.svg'}
                defaultSelected
              />
              {/** Velocity Arrows. */}
              <VRToggleButton
                label={'Velocity Arrows'}
                target={'velocityArrows'}
                iconUrl={'icons/MdiArrowTopRightThin.svg'}
                defaultSelected
              />
            </Container>
            <VRSeparator color={colors.border} />

            {/** Opacity Sliders. */}
            <Container
              flexDirection="column"
              alignItems="stretch"
              justifyContent="flex-start"
              paddingY={text.sm}
              gapRow={text.sm}
            >
              {/** Constellations. */}
              <VROpacitySliders
                label="Constellation Opacity"
                target="constellations"
              />
              {/** Celestial Grid. */}
              <VROpacitySliders
                label="Celestial Grid Opacity"
                target="celestialGrid"
              />
            </Container>
            <VRSeparator color={colors.border} />
            {/** Checkboxes. */}
            <Container
              flexDirection="column"
              alignItems="stretch"
              justifyContent="flex-start"
              paddingY={text.sm}
              gapRow={text.sm}
            >
              {/** Polar Axes. */}
              {/** Equinoxes. */}
            </Container>
          </Container>
        </RootContainer>
      </group>
    </>
  );
};

const Header = () => {
  return (
    <>
      <Container
        width={'100%'}
        flexDirection="column"
        alignItems="stretch"
        justifyContent="center"
      >
        <Text fontSize={text.lg}>Settings</Text>
      </Container>
    </>
  );
};

type VRToggleBtnProps = {
  defaultSelected?: boolean;
  label: string;
  target: keyof ContextFrom<typeof visibilityMachine>;
  iconUrl: string;
};
const VRToggleButton = ({
  target,
  label,
  defaultSelected = true,
  iconUrl,
}: VRToggleBtnProps) => {
  // Get actor from state machine.
  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const actor = useSelector(visibilityActor, ({ context }) => context[target]);
  const isActive = useSelector(actor, (state) => state.matches('active'));

  const [isHovered, setIsHovered] = useState<boolean>(false);
  useCursor(isHovered, 'pointer');

  useEffect(() => {
    // Set starting state in external state machine.
    const type = defaultSelected ? 'ENABLE' : 'DISABLE';
    actor.send({ type });
  }, [actor, defaultSelected, target]);

  const handleClick = useCallback(
    (event: ExtendedThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      actor.send({ type: 'TOGGLE' });
    },
    [actor]
  );

  return (
    <>
      <Container flexDirection="row" gapColumn={text.sm}>
        <IconButton
          aspectRatio={1}
          height={'100%'}
          borderColor={colors.border}
          border={border.base}
          borderRadius={borderRadius.sm}
          disabled={!isActive}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onPointerDown={handleClick}
        >
          <SVG url={iconUrl} />
        </IconButton>
        <Text fontSize={text.base} verticalAlign="center">
          {label}
        </Text>
      </Container>
    </>
  );
};

type VRCheckboxProps = {
  defaultSelected?: boolean;
  label: string;
  target: keyof ContextFrom<typeof visibilityMachine>;
};
const VRSettingsCheckbox = ({
  defaultSelected = false,
  label,
  target,
}: VRCheckboxProps) => {
  // Get actor from state machine.
  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const actor = useSelector(visibilityActor, ({ context }) => context[target]);
  const isActive = useSelector(actor, (state) => state.matches('active'));

  const handleSelectedChange = useCallback(
    (value: boolean) => {
      const type = value ? 'DISABLE' : 'ENABLE';
      // Send event to actor.
      actor.send({ type });
    },
    [actor]
  );

  useEffect(() => {
    // Set starting state in external state machine.
    const type = defaultSelected ? 'ENABLE' : 'DISABLE';
    actor.send({ type });
  }, [actor, defaultSelected, target]);

  return (
    <>
      <>
        <Container flexDirection="row" gapColumn={text.sm}>
          <Checkbox
            defaultSelected={defaultSelected}
            selected={isActive}
            onSelectedChange={handleSelectedChange}
          />
          <Text fontSize={text.base}>{label}</Text>
        </Container>
      </>
    </>
  );
};

type VROpacitySliderProps = {
  label: string;
  target: keyof ContextFrom<typeof celestialSphereMachine>;
};
const VROpacitySliders = ({ label, target }: VROpacitySliderProps) => {
  // Get actor from state machine.
  const { celestialSphereActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const actor = useSelector(
    celestialSphereActor,
    ({ context }) => context[target]
  );
  // Get opacity value.
  const opacity = useSelector(actor, ({ context }) => context.opacity);

  const handleValueChange = useCallback(
    (value: number) => {
      actor.send({ type: 'SET_OPACITY', opacity: value });
    },
    [actor]
  );
  return (
    <>
      <Container flexDirection="column" gapRow={text.xxs}>
        <Text fontSize={text.base}>{label}</Text>
        <Slider
          value={opacity}
          onValueChange={handleValueChange}
          range={1}
          size="md"
        />
      </Container>
    </>
  );
};
