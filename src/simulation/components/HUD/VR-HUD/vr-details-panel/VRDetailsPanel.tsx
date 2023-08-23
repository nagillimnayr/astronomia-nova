import {
  RootContainer,
  Container,
  Text,
  SVG,
  type ContainerNode,
  Object,
} from '@coconut-xr/koestlich';
import { Button, IconButton, List, ListItem } from '@coconut-xr/apfel-kruemel';
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
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import { DAY, HOUR } from '@/simulation/utils/constants';
import { VRHudBGMaterial } from '../vr-materials/VRHudBGMaterial';

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

  // Get refs to root container and object.
  const containerRef = useRef<ContainerNode>(null!);
  const objRef = useRef<Object3D>(null!);

  // const boxHelper = useHelper(objRef, BoxHelper);
  const isOpen = Boolean(selected);
  const opacity = isOpen ? 1 : 0;
  const padding = isOpen ? pad : 0;
  // Dimensions of the panel.
  const width = 1;
  const height = width * GOLDEN_RATIO;
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
            precision={PRECISION}
            ref={containerRef}
            positionType="relative"
            sizeX={width}
            sizeY={isOpen ? height : 0}
            flexDirection="column"
            alignItems="stretch"
            justifyContent="flex-start"
            material={VRHudBGMaterial}
          >
            <Container
              width={'100%'}
              height={isOpen ? '100%' : '0%'}
              borderColor={colors.border}
              borderRadius={borderRadius.base}
              border={isOpen ? border.base : 0}
              padding={padding}
              gapRow={selected ? 20 : 0}
              material={VRHudBGMaterial}
              backgroundColor={colors.background}
            >
              {/** Close Button. */}
              {isOpen && <VRCloseButton />}
              {/** Name. */}
              <Container
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                material={VRHudBGMaterial}
                backgroundColor={colors.background}
              >
                <Text
                  color={colors.foreground}
                  fontSize={text.lg}
                  material={VRHudBGMaterial}
                  backgroundColor={colors.background}
                >
                  {name}
                </Text>
              </Container>

              <VRSeparator direction="horizontal" opacity={opacity} />

              {/** Attributes. */}
              <List
                type={'inset'}
                flexDirection="column"
                gapRow={5}
                material={VRHudBGMaterial}
                backgroundColor={colors.background}
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
                  value={
                    (siderealRotationPeriod / HOUR).toLocaleString() + ' hr'
                  }
                />
                {/**  */}
                <AttributeListItem label="" value={''} />
                {/**  */}
                <AttributeListItem label="" value={''} />
              </List>
              <VRSeparator direction="horizontal" opacity={selected ? 1 : 0} />
              <VRDetailsPanelButtons />
            </Container>
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
      <Text
        marginRight={'auto'}
        fontSize={text.base}
        material={VRHudBGMaterial}
        backgroundColor={colors.background2}
      >
        {children}
      </Text>
    </>
  );
};
const AttributeValue = ({ children }: TextProp) => {
  return (
    <>
      <Text
        marginLeft={'auto'}
        fontSize={text.base}
        material={VRHudBGMaterial}
        backgroundColor={colors.background2}
      >
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
        <Container
          material={VRHudBGMaterial}
          backgroundColor={colors.background2}
        >
          <ListItem
            material={VRHudBGMaterial}
            backgroundColor={colors.background2}
            subtitle={<AttributeValue>{value}</AttributeValue>}
          >
            <AttributeLabel>{label}</AttributeLabel>
          </ListItem>
        </Container>
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
      <Container
        material={VRHudBGMaterial}
        backgroundColor={colors.background}
        positionType="absolute"
        positionTop={0}
        positionRight={0}
      >
        <Object object={obj} depth={depth.xxs}>
          <Button
            margin={pad / 2}
            border={0}
            aspectRatio={1}
            // width={closeBtnSize}
            // height={closeBtnSize}
            padding={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleCloseClick}
          >
            <Suspense>
              <SVG
                color={'white'}
                url="icons/MdiClose.svg"
                aspectRatio={1}
                width={closeBtnSize}
              />
            </Suspense>
          </Button>
        </Object>
      </Container>
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
  const { uiActor, cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const { surfaceDialogActor } = useSelector(uiActor, ({ context }) => context);

  // Only show button when in space view.
  const inSpaceView = useSelector(cameraActor, (state) =>
    state.matches('space')
  );
  // Get selection.
  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

  const handleSurfaceClick = useCallback(() => {
    cameraActor.send({
      type: 'SET_TARGET',
      focusTarget: selected,
    });
    surfaceDialogActor.send({ type: 'TOGGLE' });
  }, [cameraActor, selected, surfaceDialogActor]);

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
          onClick={handleSurfaceClick}
        >
          <Suspense>
            <Text fontSize={size} material={VRHudBGMaterial}>
              Surface
            </Text>
            <SVG url="icons/MdiTelescope.svg" aspectRatio={1} height={size} />
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
        >
          <Suspense>
            <Text fontSize={size} material={VRHudBGMaterial}>
              Space
            </Text>
            <SVG url="icons/PhPlanet.svg" aspectRatio={1} height={size} />
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
        >
          <Suspense>
            <Text fontSize={size} material={VRHudBGMaterial}>
              Focus
            </Text>
            <SVG
              url="icons/MdiCameraControl.svg"
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
        gapColumn={pad}
        material={VRHudBGMaterial}
        backgroundColor={colors.background}
      >
        <VRSurfaceButton size={text.lg} />
        <VRFocusButton size={text.lg} />
      </Container>
    </>
  );
};
