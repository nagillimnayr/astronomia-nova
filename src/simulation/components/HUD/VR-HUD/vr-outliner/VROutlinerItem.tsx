import {
  RootContainer,
  Container,
  Text,
  ContainerNode,
  Object,
  SVG,
  ExtendedThreeEvent,
} from '@coconut-xr/koestlich';
import {
  Button,
  Glass,
  IconButton,
  List,
  ListItem,
} from '@coconut-xr/apfel-kruemel';
import {
  MouseEventHandler,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  colors,
  depth,
  text,
} from '../vr-hud-constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import KeplerBody from '@/simulation/classes/kepler-body';
import { Object3D } from 'three';
import { VRHudBGMaterial } from '../vr-materials/VRHudBGMaterial';
import { useInteraction } from '@react-three/xr';
import { type Vector3Tuple } from 'three';

type VROutlinerItemProps = {
  body: KeplerBody;
  defaultOpen?: boolean;
  position?: Vector3Tuple;
};
export const VROutlinerItem = ({
  body,
  defaultOpen = false,
  position = [0, 0, 0],
}: VROutlinerItemProps) => {
  // Get actors from root state machine.
  const { mapActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Bind to state changes so that the component will re-render whenever bodyMap is modified.
  useSelector(mapActor, ({ context }) => context.bodyMap);

  // Get ref to container.
  const containerRef = useRef<ContainerNode>(null!);

  const handleClick = useCallback(() => {
    selectionActor.send({ type: 'SELECT', selection: body });
  }, [body, selectionActor]);

  // Create Object to attach UI component to.
  const obj = useMemo(() => {
    return new Object3D();
  }, []);

  // const buttonRef = useRef<Object3D>(null!);
  // const buttonObj = useMemo(() => {
  //   return new Object3D();
  // }, []);
  // buttonRef.current = buttonObj;

  // useInteraction(buttonRef, 'onHover');

  return (
    <>
      <Object object={obj} depth={1}>
        <Suspense>
          <Container
            index={index}
            ref={containerRef}
            height={'auto'}
            flexDirection="column"
            alignItems="stretch"
            justifyContent="flex-start"
            gapRow={text.xs}
            material={VRHudBGMaterial}
            backgroundColor={colors.background}
          >
            <Container
              index={index + 1}
              flexDirection="row"
              alignItems="center"
              gapColumn={text.xs}
              marginRight={text.base}
              material={VRHudBGMaterial}
              backgroundColor={colors.background}
            >
              {/* <Object object={buttonObj} depth={1}> */}
              <Button
                index={index + 2}
                height={'auto'}
                flexGrow={1} // Will stretch the button to fill as much space as it can, which will line up the eye icon buttons on the the right side.
                onClick={handleClick}
              >
                <Text index={index + 3} fontSize={text.xl}>
                  {body.name}
                </Text>
              </Button>
              {/* </Object> */}
              <Container
                index={index + 4}
                material={VRHudBGMaterial}
                backgroundColor={colors.background}
              >
                <VRVisibilityToggleButton />
              </Container>
            </Container>

            {body.orbitingBodies.length > 0 && (
              <List
                index={index + 5}
                height={'auto'}
                marginLeft={text.base}
                paddingLeft={text.base}
                borderLeft={border.base}
                borderColor={colors.border}
                flexDirection="column"
                alignItems="stretch"
                justifyContent="center"
                gapRow={text.xs}
                material={VRHudBGMaterial}
                backgroundColor={colors.background}
              >
                {body.orbitingBodies.map((child) => {
                  return (
                    <VROutlinerItem
                      index={index + 6}
                      key={child.name}
                      body={child}
                    />
                  );
                })}
              </List>
            )}
          </Container>
        </Suspense>
      </Object>
    </>
  );
};

const VRVisibilityToggleButton = () => {
  const [isVisible, setVisible] = useState(true);
  const handleClick = useCallback((event: ExtendedThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setVisible((isVisible) => !isVisible);
  }, []);
  const iconSize = 20;
  return (
    <>
      <IconButton
        onClick={handleClick}
        height={'auto'}
        aspectRatio={1}
        borderRadius={1000}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {isVisible ? (
          <SVG
            url="icons/MdiEyeOutline.svg"
            width={iconSize}
            height={iconSize}
            aspectRatio={1}
          ></SVG>
        ) : (
          <SVG
            url="icons/MdiEyeOffOutline.svg"
            width={iconSize + text.xxs} // Icons are not the exact same size.
            height={iconSize + text.xxs}
            aspectRatio={1}
            translateY={-1} // Needs to be moved down slightly to adjust.
          ></SVG>
        )}
      </IconButton>
    </>
  );
};
