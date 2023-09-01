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
  Group,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import { DAY, HOUR } from '@/simulation/utils/constants';

type VRHudControlsProps = {
  position?: Vector3Tuple;
};

export const VRHudControls = ({ position }: VRHudControlsProps) => {
  // Get actors from state machine.
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const containerRef = useRef<Group>(null!);

  const height = 1;
  const width = 2;
  return (
    <>
      <group
        ref={containerRef}
        name="VR-Hud-Controls"
        position={position}
      ></group>
    </>
  );
};
