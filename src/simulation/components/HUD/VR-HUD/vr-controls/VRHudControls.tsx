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

type VRHudControlsProps = {
  position?: Vector3Tuple;
};

export const VRHudControls = ({ position }: VRHudControlsProps) => {
  // Get actors from state machine.
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const objRef = useRef<Object3D>(null!);

  // /

  const height = 1;
  const width = 2;
  return (
    <>
      <object3D ref={objRef} name="VR-Details-Panel" position={position}>
        <RootContainer
          sizeX={width}
          sizeY={height}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-evenly"
        ></RootContainer>
      </object3D>
    </>
  );
};
