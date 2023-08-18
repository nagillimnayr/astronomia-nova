import {
  RootContainer,
  Container,
  Text,
  SVG,
  ContainerNode,
} from '@coconut-xr/koestlich';
import {
  Glass,
  Button,
  IconButton,
  List,
  ListItem,
} from '@coconut-xr/apfel-kruemel';
import { Suspense, useCallback, useEffect, useRef } from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  colors,
  text,
} from '../vr-hud-constants';
import {
  ColorRepresentation,
  Object3D,
  Vector3,
  type Vector3Tuple,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../misc/VRSeparator';
import { DAY, HOUR } from '@/simulation/utils/constants';
import { useFrame } from '@react-three/fiber';

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

  useEffect(() => {
    const controls = cameraActor.getSnapshot()!.context.controls;

    if (!controls) return;
    const obj = objRef.current;
    controls.attachToController(obj);
    obj.position.setZ(-5);
    controls.getCameraWorldUp(obj.up);
    controls.getCameraWorldPosition(_camWorldPos);
    obj.lookAt(_camWorldPos);
  }, [cameraActor]);

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
      <object3D ref={objRef} name="VR-Details-Panel">
        <Suspense>
          <RootContainer
            ref={containerRef}
            positionType="relative"
            position={position}
            backgroundColor={colors.muted}
            sizeX={width}
            sizeY={height}
            border={border.base}
            borderColor={colors.border}
            borderRadius={borderRadius.base}
            overflow="hidden"
            padding={padding}
            flexDirection="column"
            alignItems="stretch"
            justifyContent="flex-start"
            gapRow={selected ? 20 : 0}
          >
            {/** Close Button. */}
            <VRCloseButton />
            {/** Name. */}
            <Container
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              borderRadius={borderRadius.base}
            >
              <Text color={colors.foreground} fontSize={text.lg}>
                {name}
              </Text>
            </Container>

            <VRSeparator direction="horizontal" opacity={selected ? 1 : 0} />

            {/** Attributes. */}
            <List type={'inset'} flexDirection="column" gapRow={5}>
              {/** Mass. */}
              <ListItem
                subtitle={
                  <AttributeValue>
                    {mass.toExponential(3) + 'kg'}
                  </AttributeValue>
                }
              >
                <AttributeLabel>Mass</AttributeLabel>
              </ListItem>
              {/** Mean Radius. */}
              <ListItem
                subtitle={
                  <AttributeValue>
                    {meanRadius.toExponential(3) + ' m'}
                  </AttributeValue>
                }
              >
                <AttributeLabel>Mean Radius</AttributeLabel>
              </ListItem>
              {/** Sidereal Rotation Rate. */}
              <ListItem
                subtitle={
                  <AttributeValue>
                    {siderealRotationRate.toExponential(3) + ' rad/s'}
                  </AttributeValue>
                }
              >
                <AttributeLabel>Sidereal Rotation Rate</AttributeLabel>
              </ListItem>
              {/** Sidereal Rotation Period. */}
              <ListItem
                subtitle={
                  <AttributeValue>
                    {(siderealRotationPeriod / HOUR).toLocaleString() + ' hr'}
                  </AttributeValue>
                }
              >
                <AttributeLabel>Sidereal Rotation Period</AttributeLabel>
              </ListItem>
              {/**  */}
              <ListItem>
                <AttributeLabel></AttributeLabel>
              </ListItem>
              {/**  */}
              <ListItem>
                <AttributeLabel></AttributeLabel>
              </ListItem>
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
      <Text marginRight={'auto'} fontSize={text.base}>
        {children}
      </Text>
    </>
  );
};
const AttributeValue = ({ children }: TextProp) => {
  return (
    <>
      <Text marginLeft={'auto'} fontSize={text.base}>
        {children}
      </Text>
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
  return (
    <>
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
      >
        <SVG
          url="icons/mdi-close-box-outline.svg"
          aspectRatio={1}
          width={closeBtnSize}
        />
      </Button>
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
  return (
    <>
      <Button
        flexDirection={btn.flexDirection}
        flexGrow={btn.flexGrow}
        alignItems={btn.alignItems}
        justifyContent={btn.justifyContent}
        gapColumn={btn.gapColumn}
        border={btn.border}
        borderColor={btn.borderColor}
        height={size * 2}
      >
        <Text fontSize={size}>Surface</Text>
        <SVG url="icons/mdi-telescope.svg" aspectRatio={1} height={size} />
      </Button>
    </>
  );
};

const VRSpaceButton = ({ size }: VRButtonProps) => {
  return (
    <>
      <Button
        flexDirection={btn.flexDirection}
        flexGrow={btn.flexGrow}
        alignItems={btn.alignItems}
        justifyContent={btn.justifyContent}
        gapColumn={btn.gapColumn}
        border={btn.border}
        borderColor={btn.borderColor}
        height={size * 2}
      >
        <Text fontSize={size}>Space</Text>
        <SVG url="icons/ph-planet.svg" aspectRatio={1} height={size} />
      </Button>
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
  return (
    <>
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
      >
        <Text fontSize={size}>Focus</Text>
        <SVG url="icons/mdi-camera-control.svg" aspectRatio={1} height={size} />
      </Button>
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
      >
        <VRSurfaceButton size={text.lg} />
        <VRFocusButton size={text.lg} />
      </Container>
    </>
  );
};
