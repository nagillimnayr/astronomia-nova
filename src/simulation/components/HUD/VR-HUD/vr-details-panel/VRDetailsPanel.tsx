import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  colors,
  depth,
  text,
  twColors,
} from '../vr-hud-constants';
import {
  BoxHelper,
  type ColorRepresentation,
  Object3D,
  type Vector3Tuple,
  type Group,
  Vector3,
  MeshBasicMaterial,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import {
  Center,
  Circle,
  Edges,
  MeshDiscardMaterial,
  Svg,
  Text,
  useHelper,
} from '@react-three/drei';
import { ICON_MATERIAL_BASE } from '../vr-ui-materials';
import { VRFocusButton } from './VRFocusButton';
import { VRPanel } from '../vr-ui-components/VRPanel';
import { VRSurfaceButton } from './VRSurfaceButton';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { Interactive, XRInteractionEvent } from '@react-three/xr';
import { useSpring, animated, useSpringRef } from '@react-spring/three';
import { anim } from '@/simulation/components/animated-components';

const _camWorldPos = new Vector3();

const dummyFn = () => {
  return;
};

const placeholders = {
  name: '',
  mass: 0,
  meanRadius: 0,
  siderealRotationRate: 0,
  siderealRotationPeriod: 0,
};

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
  const getThree = useThree(({ get }) => get);

  // Only open if a body is selected.
  const isOpen = Boolean(selected);

  const [spring, springRef] = useSpring(() => ({ scale: 0 }));
  useEffect(() => {
    springRef.start({ scale: isOpen ? 1 : 0 });
  }, [isOpen, springRef]);

  // // Subscribe so that component will re-render upon entering VR.
  // const inVR = useSelector(vrActor, (state) => state.matches('active'));

  const containerRef = useRef<Group>(null!);
  // const boxHelper = useHelper(containerRef, BoxHelper);

  // Dimensions of the panel.
  const height = 1;
  const width = height * GOLDEN_RATIO;
  const padding = 0.1;
  const halfHeight = height / 2;
  const halfWidth = width / 2;
  const innerHeight = height - padding * 2;
  const innerWidth = width - padding * 2;
  const halfInnerHeight = innerHeight / 2;
  const halfInnerWidth = innerWidth / 2;

  // Attribute data.
  const {
    name,
    mass,
    meanRadius,
    siderealRotationRate,
    siderealRotationPeriod,
  } = selected ?? placeholders;
  const closeButtonSize = 0.0075;
  return (
    <>
      <animated.group
        name="vr-details-panel"
        ref={containerRef}
        position={position}
        scale={spring.scale}
      >
        {/** Background. */}
        <Interactive onSelect={dummyFn}>
          {/** Wrap in Interactive so it will catch rays. */}
          <VRPanel width={width} height={height} />
        </Interactive>

        <object3D
          position-x={halfInnerWidth - closeButtonSize * 10}
          position-y={halfInnerHeight - closeButtonSize * 10}
          position-z={depth.xxs}
        >
          <CloseButton size={closeButtonSize} />
        </object3D>

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
        <VRFocusButton width={0.6} position={[-0.35, -0.25, depth.xxs]} />
        <VRSurfaceButton width={0.6} position={[0.35, -0.25, depth.xxs]} />
      </animated.group>
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

type CloseButtonProps = {
  size: number;
};
const CloseButton = ({ size }: CloseButtonProps) => {
  // Get actors from root state machine.
  const { selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const [spring, springRef] = useSpring(() => ({
    scale: 1,
    bgColor: colors.background,
  }));

  const handleCloseClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      if ('stopPropagation' in event) {
        event.stopPropagation();
      }
      // Deselect the currently selected body.
      selectionActor.send({
        type: 'DESELECT',
      });
    },
    [selectionActor]
  );

  const handlePointerEnter = useCallback(() => {
    springRef.start({
      scale: 1.2,
      bgColor: colors.hover,
    });
  }, [springRef]);
  const handlePointerLeave = useCallback(() => {
    springRef.start({ scale: 1, bgColor: colors.background });
  }, [springRef]);

  const circleScale = 10;

  return (
    <>
      <object3D scale={size}>
        <animated.object3D scale={spring.scale}>
          <Interactive
            onSelect={handleCloseClick}
            onHover={handlePointerEnter}
            onBlur={handlePointerLeave}
          >
            <animated.mesh
              scale={circleScale}
              material-color={spring.bgColor}
              onClick={handleCloseClick}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
            >
              <circleGeometry />
              {/* <Edges color={'yellow'} /> */}
            </animated.mesh>
          </Interactive>

          <object3D position-z={depth.xxs}>
            <Center onCentered={dummyFn} disableZ>
              <Suspense>
                <Svg
                  src="icons/MdiClose.svg"
                  fillMaterial={ICON_MATERIAL_BASE}
                />
              </Suspense>
            </Center>
          </object3D>
        </animated.object3D>
      </object3D>
    </>
  );
};
