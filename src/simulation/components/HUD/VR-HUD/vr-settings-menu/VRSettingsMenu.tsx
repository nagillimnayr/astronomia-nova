/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  PropsWithoutRef,
  Suspense,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { GOLDEN_RATIO, colors, twColors } from '../vr-hud-constants';
import {
  Object3D,
  type Vector3Tuple,
  Vector3,
  Group,
  ColorRepresentation,
  Color,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type ContextFrom } from 'xstate';
import { type visibilityMachine } from '@/state/xstate/visibility-machine/visibility-machine';
import { useActor, useMachine, useSelector } from '@xstate/react';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import {
  Center,
  Circle,
  Edges,
  MeshDiscardMaterial,
  OnCenterCallbackProps,
  Plane,
  Svg,
  Text,
  useCursor,
} from '@react-three/drei';
import { type celestialSphereMachine } from '@/state/xstate/visibility-machine/celestial-sphere-machine';
import { dialogMachine } from '@/state/xstate/ui-machine/dialog-machine/dialog-machine';
import { toggleMachine } from '@/state/xstate/toggle-machine/toggle-machine';
import { depth } from '../vr-hud-constants';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import { VRSlider } from '../vr-ui-components/vr-slider/VRSlider';
import { VRPanel } from '../vr-ui-components/VRPanel';
import { ICON_MATERIAL_BASE } from '../vr-ui-materials';
import { VRLabel } from '../vr-ui-components/VRLabel';
import { useSpring, animated } from '@react-spring/three';
import useHover from '@/hooks/useHover';
import { PI, PI_OVER_TWO } from '@/simulation/utils/constants';
import { Interactive } from '@react-three/xr';

const _camWorldPos = new Vector3();
const _containerWorldPos = new Vector3();

const dummyFn = () => {
  return;
};
const centerDummyFn = (props: OnCenterCallbackProps) => {
  // console.log('centered:',props);
  return;
};

type VRSettingsMenuProps = {
  position?: Vector3Tuple;
  defaultOpen?: boolean;
};
export const VRSettingsMenu = ({
  position = [0, 0, 0],
  defaultOpen = false,
}: VRSettingsMenuProps) => {
  // Get actor from state machine.
  const { uiActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const vrSettingsMenuActor = useSelector(
    uiActor,
    ({ context }) => context.vrSettingsMenuActor
  );
  const getThree = useThree(({ get }) => get);
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
  const [spring, springRef] = useSpring(() => ({ scale: 0 }));
  useEffect(() => {
    springRef.start({ scale: isOpen ? 1 : 0 });
  }, [isOpen, springRef]);

  const containerRef = useRef<Group>(null!);

  const width = 1;
  const height = width * GOLDEN_RATIO;
  const padding = 0.05;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const halfInnerWidth = innerWidth / 2;
  const halfInnerHeight = innerHeight / 2;

  const iconScale = 1.8;
  return (
    <>
      <animated.group
        ref={containerRef}
        position={position}
        scale-y={spring.scale}
      >
        {/** Wrap background panel in Interactive so it will catch rays. */}
        <Interactive onSelect={dummyFn}>
          <VRPanel
            width={width}
            height={height}
            radius={0.05}
            borderWidth={0.01}
          />
        </Interactive>

        {/** Close button. */}
        <object3D
          position-x={halfInnerWidth - 0.05}
          position-y={halfInnerHeight - 0.05}
          position-z={depth.xxs}
        >
          <CloseButton onClick={handleCloseClick} />
        </object3D>

        <Text
          position-x={-halfInnerWidth}
          position-y={halfInnerHeight}
          position-z={depth.xs}
          fontSize={0.1}
          anchorX={'left'}
          anchorY={'top'}
        >
          {'Settings'}
        </Text>

        {/** Toggle Buttons. */}
        <group
          name="toggle-buttons"
          position-y={halfInnerHeight - 0.55}
          position-z={depth.xxs}
        >
          <VRSeparator
            position={[0, 0.4, 0]}
            width={innerWidth}
            height={0.01}
            color={colors.border}
          />
          <group position-x={-halfInnerWidth + 0.1}>
            {/** Trajectories. */}
            <VRToggleButton
              posY={0.3}
              label={'Trajectories'}
              target="trajectories"
              iconUrl="icons/MdiOrbit.svg"
              defaultSelected
              iconSize={0.0025 * iconScale}
            />
            {/** Annotations. */}
            <VRToggleButton
              posY={0.1}
              label={'Annotations'}
              target={'annotations'}
              iconUrl={'icons/MdiTagText.svg'}
              defaultSelected
              iconSize={0.0025 * iconScale}
            />
            {/** Markers. */}
            <VRToggleButton
              posY={-0.1}
              label={'Markers'}
              target={'markers'}
              iconUrl={'icons/MdiTarget.svg'}
              defaultSelected
              iconSize={0.003 * iconScale}
            />
          </group>
          <VRSeparator
            position={[0, -0.2, 0]}
            width={innerWidth}
            height={0.01}
            color={colors.border}
          />
        </group>

        {/** Sliders. */}
        <group position-y={0} position-z={depth.xxs}>
          {/** Constellation Opacity. */}
          <VROpacitySliders
            position={[0, -0.2, 0]}
            width={innerWidth}
            label="Constellation Opacity"
            target="constellations"
          />
        </group>
        <VRSeparator
          position={[0, -0.65, depth.xxs]}
          width={innerWidth}
          height={0.01}
          color={colors.border}
        />
        {/** Checkboxes. */}
        <group>
          {/** Polar Axes. */}
          {/** Equinoxes. */}
        </group>
      </animated.group>
    </>
  );
};

type VRToggleBtnProps = {
  posY: number;
  defaultSelected?: boolean;
  label: string;
  target: keyof ContextFrom<typeof visibilityMachine>;
  iconUrl: string;
  iconSize: number;
};
const VRToggleButton = ({
  posY,
  target,
  label,
  defaultSelected = true,
  iconUrl,
  iconSize,
}: VRToggleBtnProps) => {
  // Get actor from state machine.
  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const actor = useSelector(visibilityActor, ({ context }) => context[target]);
  const isActive = useSelector(actor, (state) => state.matches('active'));

  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');
  const { buttonScale } = useSpring({ buttonScale: isHovered ? 1.2 : 1 });

  const [colorSpring, colorSpringApi] = useSpring(() => ({
    backgroundColor: colors.background,
  }));

  useEffect(() => {
    if (isActive && !isHovered) {
      colorSpringApi.start({
        // @ts-ignore
        backgroundColor: colors.background,
      });
    } else if (isActive && isHovered) {
      colorSpringApi.start({
        // @ts-ignore
        backgroundColor: colors.hover,
      });
    } else if (!isActive && isHovered) {
      colorSpringApi.start({
        // @ts-ignore
        backgroundColor: twColors.gray[300],
      });
    } else if (!isActive && !isHovered) {
      colorSpringApi.start({
        // @ts-ignore
        backgroundColor: twColors.gray[500],
      });
    }
  }, [colorSpringApi, isActive, isHovered]);

  useEffect(() => {
    // Set starting state in external state machine.
    const type = defaultSelected ? 'ENABLE' : 'DISABLE';
    actor.send({ type });
  }, [actor, defaultSelected, target]);

  const handleClick = useCallback(() => {
    actor.send({ type: 'TOGGLE' });
  }, [actor]);

  const fontSize = 0.06;
  const panelSize = 0.15;
  return (
    <>
      <group position-y={posY} position-x={panelSize}>
        <animated.group position-x={-panelSize} scale={buttonScale}>
          <Interactive
            onSelect={handleClick}
            onHover={hoverEvents.handlePointerEnter}
            onBlur={hoverEvents.handlePointerLeave}
          >
            <VRPanel
              width={panelSize}
              height={panelSize}
              radius={panelSize * 0.075}
              borderWidth={iconSize}
              backgroundColor={colorSpring.backgroundColor}
              onPointerDown={handleClick}
              onPointerEnter={hoverEvents.handlePointerEnter}
              onPointerLeave={hoverEvents.handlePointerLeave}
            />
          </Interactive>
          <object3D position-z={0.0025}>
            <Center onCentered={centerDummyFn} disableZ>
              <Suspense>
                <Svg
                  src={iconUrl}
                  scale={iconSize}
                  fillMaterial={ICON_MATERIAL_BASE}
                />
              </Suspense>
            </Center>
          </object3D>
        </animated.group>
        {/* <Text fontSize={fontSize} anchorX="left" anchorY="middle">
          {label}
        </Text> */}
        <object3D position-z={-depth.xs}>
          <VRLabel
            fontSize={fontSize}
            anchorX="left"
            anchorY="middle"
            label={label}
          />
        </object3D>
      </group>
    </>
  );
};

type VRCheckboxProps = {
  position?: Vector3Tuple;
  defaultSelected?: boolean;
  label: string;
  target: keyof ContextFrom<typeof visibilityMachine>;
};
const VRSettingsCheckbox = ({
  position,
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
        <group position={position}>
          {/* <Checkbox
            defaultSelected={defaultSelected}
            selected={isActive}
            onSelectedChange={handleSelectedChange}
          /> */}
          <Text fontSize={0.075}>{label}</Text>
        </group>
      </>
    </>
  );
};

type VROpacitySliderProps = {
  position?: Vector3Tuple;
  width: number;
  label: string;
  target: keyof ContextFrom<typeof celestialSphereMachine>;
};
const VROpacitySliders = ({
  position,
  width,
  label,
  target,
}: VROpacitySliderProps) => {
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

  const height = 0.04;
  const thumbRadius = height * 1.2;
  const innerWidth = width - thumbRadius * 2;
  const halfWidth = width / 2;
  const halfInnerWidth = innerWidth / 2;
  const halfHeight = height / 2;
  const fontSize = 0.075;
  const labelYOffset = height + thumbRadius;
  return (
    <>
      <group position={position}>
        <Text
          position-x={-halfWidth}
          position-y={labelYOffset}
          fontSize={fontSize}
          anchorX={'left'}
          anchorY={'bottom'}
        >
          {label}
        </Text>
        <VRSlider
          value={opacity}
          width={innerWidth}
          height={height}
          min={0}
          max={1}
          step={0.01}
          thumbRadius={thumbRadius}
          onValueChange={handleValueChange}
          fillColor={'white'}
          trackColor={'black'}
        />
        {/** End-caps. */}
        <Circle
          args={[1, 32, PI_OVER_TWO, PI]}
          position-x={-halfInnerWidth}
          position-z={depth.xxs / 2}
          scale={halfHeight}
          material-color={'white'}
        />
        <Circle
          args={[1, 32, 3 * PI_OVER_TWO, PI]}
          position-x={halfInnerWidth}
          // position-z={depth.xxs / 2}
          scale={halfHeight}
          material-color={'black'}
        />
      </group>
    </>
  );
};

type CloseButtonProps = {
  position?: Vector3Tuple;
  onClick: () => void;
};
const CloseButton = ({ position, onClick }: CloseButtonProps) => {
  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');
  const { scale } = useSpring({ scale: isHovered ? 1.2 : 1 });

  return (
    <>
      <animated.group
        position={position}
        scale={scale}
        onClick={onClick}
        onPointerEnter={hoverEvents.handlePointerEnter}
        onPointerLeave={hoverEvents.handlePointerLeave}
      >
        <Interactive
          onSelect={onClick}
          onHover={hoverEvents.handlePointerEnter}
          onBlur={hoverEvents.handlePointerLeave}
        >
          <Plane scale={0.075}>
            <MeshDiscardMaterial />
            <Edges visible={false} scale={1} color={'yellow'} />
          </Plane>
        </Interactive>
        <object3D scale={0.005} position-z={0.0025}>
          <Center onCentered={dummyFn}>
            <Suspense>
              <Svg src="icons/MdiClose.svg" fillMaterial={ICON_MATERIAL_BASE} />
            </Suspense>
          </Center>
        </object3D>
      </animated.group>
    </>
  );
};
