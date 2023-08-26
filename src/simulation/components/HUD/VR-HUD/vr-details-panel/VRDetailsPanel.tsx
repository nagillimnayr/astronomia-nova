import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  GOLDEN_RATIO,
  PRECISION,
  border,
  borderRadius,
  colors,
  depth,
  text,
} from '../vr-hud-constants';
import {
  BoxHelper,
  type ColorRepresentation,
  Object3D,
  type Vector3Tuple,
  Group,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import { DAY, HOUR } from '@/simulation/utils/constants';
import { Svg, Text, useHelper } from '@react-three/drei';
import { ICON_MATERIAL_BASE } from '../vr-ui-materials';
import { VRFocusButton } from './VRFocusButton';
import { VRPanel } from '../vr-ui-components/VRPanel';

const FONT_SIZE = 0.05;

const placeholders = {
  name: 'Name',
  mass: 0,
  meanRadius: 0,
  siderealRotationRate: 0,
  siderealRotationPeriod: 0,
};

const pad = text.md;

type VRDetailsPanelProps = {
  position?: Vector3Tuple;
};
export const VRDetailsPanel = ({
  position = [0, 0, 0],
}: VRDetailsPanelProps) => {
  // Get selection actor from state machine.
  const { selectionActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // Get the currently selected body.
  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

  const containerRef = useRef<Group>(null!);
  const boxHelper = useHelper(containerRef, BoxHelper);

  // Only open if a body is selected.
  const isOpen = Boolean(selected);

  // Dimensions of the panel.
  const height = 1;
  const width = height * GOLDEN_RATIO;

  // Attribute data.
  const {
    name,
    mass,
    meanRadius,
    siderealRotationRate,
    siderealRotationPeriod,
  } = selected ?? placeholders;

  return (
    <>
      <group ref={containerRef} name="vr-details-panel" position={position}>
        {/** Background. */}
        <VRPanel width={width} height={height} />

        {/** Name. */}
        <Header position={[0, height / 3, depth.xs]} name={name} />

        {/** Buttons. */}

        <VRFocusButton width={0.5} position={[-0.35, -0.25, depth.xs]} />
        <VRFocusButton width={0.5} position={[0.35, -0.25, depth.xs]} />
      </group>
    </>
  );
};

type HeaderProps = {
  name: string;
  position?: Vector3Tuple;
};
const Header = ({ name, position }: HeaderProps) => {
  return (
    <>
      <Text
        position={position}
        fontSize={text.lg}
        anchorX={'center'}
        anchorY={'top'}
      >
        {name}
      </Text>
    </>
  );
};

type AttributeListProps = {
  position?: Vector3Tuple;
  height: number;
};
const AttributeList = ({ position, height }: AttributeListProps) => {
  return (
    <>
      {/** Attributes. */}

      {/** Mass. */}
      {/* <Attribute label={'Mass'} value={mass.toExponential(3) + ' kg'} /> */}

      {/** Mean Radius. */}
      {/* <Attribute
        label={'Mean Radius'}
        value={meanRadius.toExponential(3) + ' m'}
      /> */}

      {/** Sidereal Rotation Rate. */}
      {/* <Attribute
        label={'Sidereal Rotation Rate'}
        value={siderealRotationRate.toExponential(3) + ' rad/s'}
      /> */}

      {/** Sidereal Rotation Period. */}
      {/* <Attribute
        label={'Sidereal Rotation Period'}
        value={(siderealRotationPeriod / HOUR).toLocaleString() + ' hr'}
      /> */}
    </>
  );
};

type TextProps = {
  children?: string;
  position?: Vector3Tuple;
};
const AttributeLabel = ({ children, position }: TextProps) => {
  return (
    <Text
      position={position}
      fontSize={text.md}
      anchorX={'center'}
      anchorY={'middle'}
    >
      {children}
    </Text>
  );
};
const AttributeValue = ({ children, position }: TextProps) => {
  return (
    <Text
      position={position}
      fontSize={text.md}
      anchorX={'center'}
      anchorY={'middle'}
    >
      {children}
    </Text>
  );
};

type AttributeProps = {
  position?: Vector3Tuple;
  label: string;
  value: string;
};
const Attribute = ({ position, label, value }: AttributeProps) => {
  const groupRef = useRef<Group>(null!);
  useHelper(groupRef, BoxHelper);
  return (
    <>
      <group ref={groupRef}>
        <AttributeLabel position={[-0.5, 0, 0]}>{label}</AttributeLabel>

        <AttributeValue position={[0.5, 0, 0]}>{value}</AttributeValue>
      </group>
    </>
  );
};

const closeBtnSize = text.base;
const VRCloseButton = () => {
  // Get actors from root state machine.
  const { selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const handleCloseClick = useCallback(() => {
    // Deselect the currently selected body.
    selectionActor.send({ type: 'DESELECT' });
  }, [selectionActor]);

  // Create Object to attach UI component to.

  return (
    <>
      <object3D>
        <Svg src="icons/MdiClose.svg" fillMaterial={ICON_MATERIAL_BASE} />
      </object3D>
    </>
  );
};

type VRButtonProps = {
  size: number;
};
const VRSurfaceButton = ({ size }: VRButtonProps) => {
  const { uiActor, cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const { surfaceDialogActor } = useSelector(uiActor, ({ context }) => context);

  // Only show button when in space view.
  const inSpaceView = useSelector(cameraActor, (state) =>
    state.matches('space')
  );

  const handleSurfaceClick = useCallback(() => {
    // Get selection.
    const { selected } = selectionActor.getSnapshot()!.context;
    cameraActor.send({
      type: 'SET_TARGET',
      focusTarget: selected,
    });
    surfaceDialogActor.send({ type: 'TOGGLE' });
  }, [cameraActor, selectionActor, surfaceDialogActor]);

  return (
    <>
      <object3D>
        <Text fontSize={size}>Surface</Text>
        <Svg src="icons/MdiTelescope.svg" />
      </object3D>
    </>
  );
};

const VRSpaceButton = ({ size }: VRButtonProps) => {
  //

  return (
    <>
      <object3D>
        <Text fontSize={size}>Space</Text>
        <Svg src="icons/PhPlanet.svg" />
      </object3D>
    </>
  );
};

const VRDetailsPanelButtons = () => {
  return (
    <>
      <group>
        {/* <VRSurfaceButton size={text.lg} /> */}
        <VRFocusButton width={0.2} />
      </group>
    </>
  );
};
