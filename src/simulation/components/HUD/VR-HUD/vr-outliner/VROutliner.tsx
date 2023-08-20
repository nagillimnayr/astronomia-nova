import {
  RootContainer,
  Container,
  Text,
  ContainerNode,
} from '@coconut-xr/koestlich';
import { Glass, IconButton, List, ListItem } from '@coconut-xr/apfel-kruemel';
import { Suspense, useRef, useEffect, useMemo } from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  colors,
  text,
} from '../vr-hud-constants';
import { BoxHelper, Object3D, Vector3, type Vector3Tuple } from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import { VROutlinerItem } from './VROutlinerItem';
import { useFrame } from '@react-three/fiber';
import { useHelper } from '@react-three/drei';

const _camWorldPos = new Vector3();

type VROutlinerProps = {
  position?: Vector3Tuple;
};
export const VROutliner = ({ position = [0, 0, 0] }: VROutlinerProps) => {
  // Get actors from root state machine.
  const { keplerTreeActor, mapActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // Get root node of Kepler Tree.
  const root = useSelector(keplerTreeActor, ({ context }) => context.root);

  // Bind to state changes so that the component will re-render whenever bodyMap is modified.
  useSelector(mapActor, ({ context }) => context.bodyMap);

  // Get refs to root container and object.
  const containerRef = useRef<ContainerNode>(null!);
  const objRef = useRef<Object3D>(null!);

  // const boxHelper = useHelper(objRef, BoxHelper);

  const width = 1;
  const height = width * GOLDEN_RATIO;
  return (
    <>
      {/** Its better to put the object3D outside of the Suspense barrier, so as to not delay setting the reference. */}
      <object3D position={position} ref={objRef} name="VR-Outliner">
        <Suspense>
          <RootContainer
            ref={containerRef}
            sizeX={width}
            sizeY={height}
            flexDirection="column"
            // padding={text.base}
          >
            <Container
              padding={text.base}
              borderRadius={borderRadius.base}
              border={border.base}
              borderColor={colors.border}
              backgroundColor={colors.background}
              height={'100%'}
              flexDirection="column"
              alignItems="stretch"
              justifyContent="flex-start"
            >
              {root && <VROutlinerItem body={root} />}
            </Container>
          </RootContainer>
        </Suspense>
      </object3D>
    </>
  );
};
