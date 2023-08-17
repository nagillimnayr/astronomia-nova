import { RootContainer, Container, Text } from '@coconut-xr/koestlich';
import { Glass, IconButton, List, ListItem } from '@coconut-xr/apfel-kruemel';
import { Suspense } from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  color,
  text,
} from '../vr-hud-constants';
import { type Vector3Tuple } from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../misc/VRSeparator';
import { DAY, HOUR } from '@/simulation/utils/constants';

const placeholders = {
  name: 'Name',
  mass: 5.972e25,
  meanRadius: 6.371e6,
  siderealRotationRate: 7.292e-5,
  siderealRotationPeriod: 23.934 * HOUR,
};

type VRDetailsPanelProps = {
  position?: Vector3Tuple;
};
export const VRDetailsPanel = ({
  position = [0, 0, 0],
}: VRDetailsPanelProps) => {
  // Get selection actor from state machine.
  const { selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // Get the currently selected body.
  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

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
      <Suspense>
        <RootContainer
          position={position}
          backgroundColor={color.muted}
          sizeX={width}
          sizeY={height}
          border={border.base}
          borderColor={color.border}
          borderRadius={borderRadius.base}
          padding={20}
          flexDirection="column"
          alignItems="stretch"
          justifyContent="flex-start"
          gapRow={20}
        >
          {/** Name. */}
          <Container
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            borderRadius={borderRadius.base}
          >
            <Text color={color.foreground} fontSize={text.lg}>
              {name}
            </Text>
          </Container>

          <VRSeparator direction="horizontal" />

          {/** Attributes. */}
          <List type={'inset'} flexDirection="column" gapRow={5}>
            {/** Mass. */}
            <ListItem
              subtitle={
                <AttributeValue>{mass.toExponential(3) + 'kg'}</AttributeValue>
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
          <VRSeparator direction="horizontal" />
        </RootContainer>
      </Suspense>
    </>
  );
};

type TextProp = {
  children?: string;
};
const AttributeLabel = ({ children }: TextProp) => {
  return (
    <>
      <Text marginRight={'auto'} fontSize={text.md}>
        {children}
      </Text>
    </>
  );
};
const AttributeValue = ({ children }: TextProp) => {
  return (
    <>
      <Text marginLeft={'auto'} fontSize={text.md}>
        {children}
      </Text>
    </>
  );
};
