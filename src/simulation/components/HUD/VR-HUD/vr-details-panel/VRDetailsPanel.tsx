import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  GOLDEN_RATIO,
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
  type Group,
  Vector3,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { Svg, Text, useHelper } from '@react-three/drei';
import { ICON_MATERIAL_BASE } from '../vr-ui-materials';
import { VRFocusButton } from './VRFocusButton';
import { VRPanel } from '../vr-ui-components/VRPanel';
import { VRSurfaceButton } from './VRSurfaceButton';
import { useThree } from '@react-three/fiber';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';

const _camWorldPos = new Vector3();
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
  scale?: number;
};
export const VRDetailsPanel = ({
  position = [0, 0, 0],
  scale = 1,
}: VRDetailsPanelProps) => {
  // Get selection actor from state machine.
  const { selectionActor, cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // Get the currently selected body.
  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

  // Only open if a body is selected.
  const isOpen = Boolean(selected);

  const getThree = useThree(({ get }) => get);

  // // Subscribe so that component will re-render upon entering VR.
  // const inVR = useSelector(vrActor, (state) => state.matches('active'));

  const containerRef = useRef<Group>(null!);
  // const boxHelper = useHelper(containerRef, BoxHelper);

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
      <group
        name="vr-details-panel"
        position={position}
        scale={scale}
        visible={isOpen}
        ref={(container) => {
          if (!container) return;
          containerRef.current = container;

          // Look at camera.
          const { camera } = getThree();
          camera.getWorldPosition(_camWorldPos);
          getLocalUpInWorldCoords(camera, container.up);
          container.lookAt(_camWorldPos);
        }}
      >
        {/** Background. */}
        <VRPanel width={width} height={height} />

        {/** Name. */}
        <Text
          position={[0, height / 4, depth.xs]}
          fontSize={height / 4}
          anchorX={'center'}
          anchorY={'top'}
        >
          {name}
        </Text>

        {/** Buttons. */}
        <VRFocusButton width={0.6} position={[-0.35, -0.25, depth.xs]} />
        <VRSurfaceButton width={0.6} position={[0.35, -0.25, depth.xs]} />
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
