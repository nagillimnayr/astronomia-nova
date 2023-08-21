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
import { useActor, useMachine, useSelector } from '@xstate/react';
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
import { celestialSphereMachine } from '@/state/xstate/visibility-machine/celestial-sphere-machine';
import { dialogMachine } from '@/state/xstate/ui-machine/dialog-machine/dialog-machine';
import { toggleMachine } from '@/state/xstate/toggle-machine/toggle-machine';

type VRSettingsMenuProps = {
  position?: Vector3Tuple;
  defaultOpen?: boolean;
};
export const VRSettingsMenu = ({
  position = [0, 0, 0],
  defaultOpen = false,
}: VRSettingsMenuProps) => {
  // Get actor from state machine.
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const vrSettingsMenuActor = useSelector(
    uiActor,
    ({ context }) => context.vrSettingsMenuActor
  );

  const [state, send] = useActor(vrSettingsMenuActor);

  // Close button click handler.
  const handleCloseClick = useCallback(() => {
    vrSettingsMenuActor.send({ type: 'DISABLE' });
  }, [vrSettingsMenuActor]);

  useEffect(() => {
    const type = defaultOpen ? 'ENABLE' : 'DISABLE';
    vrSettingsMenuActor.send({ type });
  }, [vrSettingsMenuActor, defaultOpen]);

  const isOpen = state.matches('active');

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
            height={isOpen ? '100%' : '0%'}
            backgroundOpacity={isOpen ? 1 : 0}
            borderOpacity={isOpen ? 1 : 0}
            flexDirection="column"
            alignItems="stretch"
            justifyContent="flex-start"
          >
            {/** Close button. */}
            {isOpen && (
              <IconButton
                positionType="absolute"
                positionTop={0}
                positionRight={0}
                onClick={handleCloseClick}
              >
                <SVG url="icons/MdiClose.svg" />
              </IconButton>
            )}
            <Header />

            <VRSeparator color={colors.border} opacity={isOpen ? 1 : 0} />

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
                height={text.xxl}
              />
              {/** Annotations. */}
              <VRToggleButton
                label={'Annotations'}
                target={'annotations'}
                iconUrl={'icons/MdiTagText.svg'}
                defaultSelected
                height={text.xxl}
              />
              {/** Markers. */}
              <VRToggleButton
                label={'Markers'}
                target={'markers'}
                iconUrl={'icons/MdiTarget.svg'}
                defaultSelected
                height={text.xxl}
              />
              {/** Velocity Arrows. */}
              <VRToggleButton
                label={'Velocity Arrows'}
                target={'velocityArrows'}
                iconUrl={'icons/MdiArrowTopRightThin.svg'}
                defaultSelected
                height={text.xxl}
              />
            </Container>
            <VRSeparator color={colors.border} opacity={isOpen ? 1 : 0} />

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
            <VRSeparator color={colors.border} opacity={isOpen ? 1 : 0} />
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
        <Text fontSize={text.xl}>Settings</Text>
      </Container>
    </>
  );
};

type VRToggleBtnProps = Pick<ContainerProperties, 'height'> & {
  defaultSelected?: boolean;
  label: string;
  target: keyof ContextFrom<typeof visibilityMachine>;
  iconUrl: string;
};
const VRToggleButton = ({
  height = text.xl,
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
      <Container
        flexDirection="row"
        gapColumn={text.sm}
        height={height}
        maxHeight={'100%'}
      >
        <IconButton
          aspectRatio={1}
          height={height}
          width={height}
          maxHeight={'100%'}
          borderColor={colors.border}
          border={border.base}
          borderRadius={borderRadius.sm}
          disabled={!isActive}
          padding={text.xs}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onPointerDown={handleClick}
        >
          <SVG url={iconUrl} height={'100%'} width={'100%'} aspectRatio={1} />
        </IconButton>
        <Text fontSize={text.lg} verticalAlign="center">
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

const VRCloseButton = () => {
  return (
    <>
      <IconButton></IconButton>
    </>
  );
};
