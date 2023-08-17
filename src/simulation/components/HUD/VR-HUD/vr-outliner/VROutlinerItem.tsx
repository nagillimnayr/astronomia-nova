import { RootContainer, Container, Text } from '@coconut-xr/koestlich';
import { Glass, IconButton, List, ListItem } from '@coconut-xr/apfel-kruemel';
import { Suspense, useCallback } from 'react';
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

  const handleClick = useCallback(() => {
    selectionActor.send({ type: 'SELECT', selection: body });
  }, [body, selectionActor]);
  return (
    <>
      <Suspense>
        <Container flexDirection="column" height={'auto'}>
          <ListItem height={'auto'} onClick={handleClick}>
            <Text fontSize={text.xl}>{body.name}</Text>
          </ListItem>
          <List
            flexDirection="column"
            height={'auto'}
            marginLeft={text.base}
            gapRow={text.xs}
          >
            {body.orbitingBodies.map((child) => {
              return <VROutlinerItem key={body.name} body={child} />;
            })}
          </List>
        </Container>
      </Suspense>
    </>
  );
};
