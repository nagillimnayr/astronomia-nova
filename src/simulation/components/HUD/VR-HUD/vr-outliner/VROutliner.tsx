import { Suspense, useRef, useEffect, useMemo } from 'react';
import {
  GOLDEN_RATIO,
  PRECISION,
  border,
  borderRadius,
  colors,
  text,
} from '../vr-hud-constants';
import { BoxHelper, Group, Object3D, Vector3, type Vector3Tuple } from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import { VROutlinerItem } from './VROutlinerItem';
import { useFrame } from '@react-three/fiber';
import { useHelper } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

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

  const containerRef = useRef<Group>(null!);

  const width = 1;
  const height = width * GOLDEN_RATIO;
  return (
    <>
      <animated.group position={position} ref={containerRef} name="VR-Outliner">
        {root !== null && root !== undefined && <VROutlinerItem body={root} />}
      </animated.group>
    </>
  );
};
