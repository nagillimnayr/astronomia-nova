import {
  RootContainer,
  Container,
  Text,
  SVG,
  ContainerNode,
  Object,
  noAnimation,
} from '@coconut-xr/koestlich';
import {
  Glass,
  Button,
  IconButton,
  List,
  ListItem,
} from '@coconut-xr/apfel-kruemel';
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
  ColorRepresentation,
  Object3D,
  Vector3,
  type Vector3Tuple,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import { DAY, HOUR } from '@/simulation/utils/constants';
import { useFrame } from '@react-three/fiber';
import { VRButton } from '../vr-ui-components/VRButton';
import { Plane, useHelper } from '@react-three/drei';
import { useEventListener, useKeyPressed } from '@react-hooks-library/core';

const _camWorldPos = new Vector3();

const placeholders = {
  name: 'Name',
  mass: 0,
  meanRadius: 0,
  siderealRotationRate: 0,
  siderealRotationPeriod: 0,
};

const padding = text.md;

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

  // Get refs to root container and object.
  const containerRef = useRef<ContainerNode>(null!);
  const objRef = useRef<Object3D>(null!);

  // const boxHelper = useHelper(objRef, BoxHelper);

  // Dimensions of the panel.
  const width = 1;
  const height = selected ? width * GOLDEN_RATIO : 0; // Collapse the panel if nothing is currently selected.

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
      {/** Its better to put the object3D outside of the Suspense barrier, so as to not delay setting the reference. */}
      <object3D ref={objRef} name="VR-Details-Panel" position={position}>
        <Suspense>
          <RootContainer
            ref={containerRef}
            positionType="relative"
            backgroundColor={colors.background}
            sizeX={width}
            sizeY={height}
            border={border.base}
            borderColor={colors.border}
            borderRadius={borderRadius.base}
            padding={padding}
            flexDirection="column"
            alignItems="stretch"
            justifyContent="flex-start"
            gapRow={selected ? 20 : 0}
            overflow="visible"
          >
            {/** Close Button. */}
            <VRCloseButton />
            {/** Name. */}
            <Container
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              // backgroundColor={colors.background}

              overflow="visible"
            >
              <Text
                color={colors.foreground}
                fontSize={text.lg}
                // backgroundColor={colors.background}

                overflow="visible"
              >
                {name}
              </Text>
            </Container>

            <VRSeparator direction="horizontal" opacity={selected ? 1 : 0} />

            {/** Attributes. */}
            <List
              type={'inset'}
              flexDirection="column"
              gapRow={5}
              overflow="visible"
            >
              {/** Mass. */}
              <AttributeListItem
                label="Mass"
                value={mass.toExponential(3) + 'kg'}
              />
              {/** Mean Radius. */}
              <AttributeListItem
                label="Mean Radius"
                value={meanRadius.toExponential(3) + ' m'}
              />
              {/** Sidereal Rotation Rate. */}
              <AttributeListItem
                label="Sidereal Rotation Rate"
                value={siderealRotationRate.toExponential(3) + ' rad/s'}
              />
              {/** Sidereal Rotation Period. */}
              <AttributeListItem
                label="Sidereal Rotation Period"
                value={(siderealRotationPeriod / HOUR).toLocaleString() + ' hr'}
              />
              {/**  */}
              <AttributeListItem label="" value={''} />
              {/**  */}
              <AttributeListItem label="" value={''} />
            </List>
            <VRSeparator direction="horizontal" opacity={selected ? 1 : 0} />
            <VRDetailsPanelButtons />
          </RootContainer>
        </Suspense>
      </object3D>
    </>
  );
};

type TextProp = {
  children?: string;
};
const AttributeLabel = ({ children }: TextProp) => {
  return (
    <>
      <Text marginRight={'auto'} fontSize={text.base} overflow="visible">
        {children}
      </Text>
    </>
  );
};
const AttributeValue = ({ children }: TextProp) => {
  return (
    <>
      <Text marginLeft={'auto'} fontSize={text.base} overflow="visible">
        {children}
      </Text>
    </>
  );
};

type AttributeProps = {
  label: string;
  value: string;
};
const AttributeListItem = ({ label, value }: AttributeProps) => {
  // Create Object to attach UI component to.
  const obj = useMemo(() => {
    return new Object3D();
  }, []);
  return (
    <>
      <Object object={obj} depth={depth.xxs}>
        <ListItem
          subtitle={<AttributeValue>{value}</AttributeValue>}
          overflow="visible"
        >
          <AttributeLabel>{label}</AttributeLabel>
        </ListItem>
      </Object>
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
  const obj = useMemo(() => {
    return new Object3D();
  }, []);
  return (
    <>
      {/* <Object object={obj} depth={depth.xxs}> */}
      <Button
        positionType="absolute"
        positionTop={0}
        positionRight={0}
        margin={padding / 2}
        border={0}
        borderRadius={4}
        aspectRatio={1}
        width={closeBtnSize}
        height={closeBtnSize}
        padding={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={handleCloseClick}
        overflow="visible"
      >
        <Suspense>
          <SVG
            color={colors.foreground}
            url="icons/mdi-close-box-outline.svg"
            aspectRatio={1}
            width={closeBtnSize}
          />
        </Suspense>
      </Button>
      {/* </Object> */}
    </>
  );
};

type BtnStyles = {
  flexDirection: 'column' | 'column-reverse' | 'row' | 'row-reverse';
  flexGrow: number;
  alignItems:
    | 'auto'
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'stretch'
    | 'baseline'
    | 'space-between'
    | 'space-around';
  justifyContent:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  gapColumn: number;
  border: number;
  borderColor: ColorRepresentation;
};
const btn: BtnStyles = {
  flexDirection: 'row',
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gapColumn: 12,
  border: border.sm,
  borderColor: colors.border,
};

type VRButtonProps = {
  size: number;
};
const VRSurfaceButton = ({ size }: VRButtonProps) => {
  // Create Object to attach UI component to.
  const obj = useMemo(() => {
    return new Object3D();
  }, []);
  return (
    <>
      <Object object={obj} depth={depth.xxs}>
        <Button
          flexDirection={btn.flexDirection}
          flexGrow={btn.flexGrow}
          alignItems={btn.alignItems}
          justifyContent={btn.justifyContent}
          gapColumn={btn.gapColumn}
          border={btn.border}
          borderColor={btn.borderColor}
          height={size * 2}
          overflow="visible"
        >
          <Suspense>
            <Text fontSize={size} overflow="visible">
              Surface
            </Text>
            <SVG url="icons/mdi-telescope.svg" aspectRatio={1} height={size} />
          </Suspense>
        </Button>
      </Object>
    </>
  );
};

const VRSpaceButton = ({ size }: VRButtonProps) => {
  // Create Object to attach UI component to.
  const obj = useMemo(() => {
    return new Object3D();
  }, []);
  return (
    <>
      <Object object={obj} depth={depth.xxs}>
        <Button
          flexDirection={btn.flexDirection}
          flexGrow={btn.flexGrow}
          alignItems={btn.alignItems}
          justifyContent={btn.justifyContent}
          gapColumn={btn.gapColumn}
          border={btn.border}
          borderColor={btn.borderColor}
          height={size * 2}
          overflow="visible"
        >
          <Suspense>
            <Text fontSize={size} overflow="visible">
              Space
            </Text>
            <SVG url="icons/ph-planet.svg" aspectRatio={1} height={size} />
          </Suspense>
        </Button>
      </Object>
    </>
  );
};

const VRFocusButton = ({ size }: VRButtonProps) => {
  // Get actors from root state machine.
  const { selectionActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const handleClick = useCallback(() => {
    // Get the currently selected body.
    const selected = selectionActor.getSnapshot()!.context.selected;
    if (!selected) {
      // it shouldn't be possible to click the button if nothing is selected. So something has gone very wrong.
      const err = 'Error! no body selected. This should not be possible.';
      console.error(err);
      throw new Error(err);
    }
    // Pass the selected body to the camera actor.
    cameraActor.send({ type: 'SET_TARGET', focusTarget: selected });
  }, [cameraActor, selectionActor]);

  // Create Object to attach UI component to.
  const obj = useMemo(() => {
    return new Object3D();
  }, []);
  return (
    <>
      <Object object={obj} depth={depth.xxs}>
        <Button
          flexDirection={btn.flexDirection}
          flexGrow={btn.flexGrow}
          alignItems={btn.alignItems}
          justifyContent={btn.justifyContent}
          gapColumn={btn.gapColumn}
          border={btn.border}
          borderColor={btn.borderColor}
          height={size * 2}
          onClick={handleClick}
          overflow="visible"
        >
          <Suspense>
            <Text fontSize={size} overflow="visible">
              Focus
            </Text>
            <SVG
              url="icons/mdi-camera-control.svg"
              aspectRatio={1}
              height={size}
            />
          </Suspense>
        </Button>
      </Object>
    </>
  );
};

const VRDetailsPanelButtons = () => {
  return (
    <>
      <Container
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gapColumn={padding}
        overflow="visible"
      >
        <VRSurfaceButton size={text.lg} />
        <VRFocusButton size={text.lg} />
      </Container>
    </>
  );
};
