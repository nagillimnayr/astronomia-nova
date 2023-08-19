import {
  RootContainer,
  Container,
  Text,
  ContainerNode,
  Object,
} from '@coconut-xr/koestlich';
import {
  Button,
  Glass,
  IconButton,
  List,
  ListItem,
} from '@coconut-xr/apfel-kruemel';
import { Suspense, useCallback, useMemo, useRef } from 'react';
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

type VROutlinerItemProps = {
  body: KeplerBody;
  defaultOpen?: boolean;
};
export const VROutlinerItem = ({
  body,
  defaultOpen = false,
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
  return (
    <>
      <Object object={obj} depth={depth.xxs}>
        <Suspense>
          <Container
            ref={containerRef}
            height={'auto'}
            flexDirection="column"
            alignItems="stretch"
            justifyContent="flex-start"
            gapRow={text.xs}
          >
            <Container>
              <Button height={'auto'} onClick={handleClick}>
                <Text fontSize={text.xl}>{body.name}</Text>
              </Button>
            </Container>

            {body.orbitingBodies.length > 0 && (
              <List
                height={'auto'}
                marginLeft={text.base}
                paddingLeft={text.base}
                borderLeft={border.base}
                borderColor={colors.border}
                flexDirection="column"
                alignItems="stretch"
                justifyContent="center"
                gapRow={text.xs}
              >
                {body.orbitingBodies.map((child) => {
                  return <VROutlinerItem key={child.name} body={child} />;
                })}
              </List>
            )}
          </Container>
        </Suspense>
      </Object>
    </>
  );
};
