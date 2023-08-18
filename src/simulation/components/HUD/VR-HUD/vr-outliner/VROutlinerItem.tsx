import {
  RootContainer,
  Container,
  Text,
  ContainerNode,
} from '@coconut-xr/koestlich';
import { Glass, IconButton, List, ListItem } from '@coconut-xr/apfel-kruemel';
import { Suspense, useCallback, useRef } from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  colors,
  text,
} from '../vr-hud-constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../misc/VRSeparator';
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
  return (
    <>
      <Suspense>
        <Container
          ref={containerRef}
          flexDirection="column"
          height={'auto'}
          backgroundColor={colors.background}
          gapRow={text.sm}
        >
          <ListItem height={'auto'} onClick={handleClick}>
            <Text fontSize={text.xl}>{body.name}</Text>
          </ListItem>
          <List
            flexDirection="column"
            height={'auto'}
            gapRow={text.xs}
            backgroundColor={colors.background}
            marginLeft={text.base}
            paddingLeft={text.base}
            borderLeft={border.base}
          >
            {body.orbitingBodies.map((child) => {
              return <VROutlinerItem key={child.name} body={child} />;
            })}
          </List>
        </Container>
      </Suspense>
    </>
  );
};
