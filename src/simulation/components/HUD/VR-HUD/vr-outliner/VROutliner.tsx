import { RootContainer, Container, Text } from '@coconut-xr/koestlich';
import { Glass, IconButton, List, ListItem } from '@coconut-xr/apfel-kruemel';
import { Suspense } from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  colors,
  text,
} from '../vr-hud-constants';
import { type Vector3Tuple } from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../misc/VRSeparator';
import { VROutlinerItem } from './VROutlinerItem';

type VROutlinerProps = {
  position?: Vector3Tuple;
};
export const VROutliner = ({ position }: VROutlinerProps) => {
  // Get actors from root state machine.
  const { keplerTreeActor, mapActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // Get root node of Kepler Tree.
  const root = useSelector(keplerTreeActor, ({ context }) => context.root);

  // Bind to state changes so that the component will re-render whenever bodyMap is modified.
  useSelector(mapActor, ({ context }) => context.bodyMap);

  const width = 1;
  const height = width * GOLDEN_RATIO;
  return (
    <>
      <Suspense>
        <RootContainer
          position={position}
          sizeX={width}
          sizeY={height}
          border={border.base}
          borderRadius={borderRadius.base}
          backgroundColor={colors.muted}
          flexDirection="column"
          padding={text.base}
        >
          {root && <VROutlinerItem body={root} />}
        </RootContainer>
      </Suspense>
    </>
  );
};
