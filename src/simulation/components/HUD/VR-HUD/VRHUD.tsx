import {
  ContainerNode,
  DefaultStyleProvider,
  RootContainer,
} from '@coconut-xr/koestlich';
import { VRDetailsPanel } from './vr-details-panel/VRDetailsPanel';
import { VRTimePanel } from './vr-time-panel/VRTimePanel';
import { colors, text } from './vr-hud-constants';
import { VROutliner } from './vr-outliner/VROutliner';
import {
  BoxHelper,
  Group,
  Object3D,
  Scene,
  Vector3,
  PerspectiveCamera,
  type Vector3Tuple,
} from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSettingsMenu } from './vr-settings-menu/VRSettingsMenu';
import { Hud, useCamera, useHelper } from '@react-three/drei';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { VRSettingsButton } from './vr-settings-menu/VRSettingsButton';
import { METER } from '@/simulation/utils/constants';
import { VRDebugDisplay } from './VRDebugDisplay';

type VRHUDProps = {
  position?: Vector3Tuple;
};
export const VRHUD = ({ position = [0, 0, -5] }: VRHUDProps) => {
  // Get the current default camera so we can render the VRHUD to it.
  const camera = useThree(({ camera }) => camera);

  // Attach the VRHUD to the camera.
  return createPortal(
    <>
      <VRHud position={position} />
    </>,
    camera
  );
};

type Props = VRHUDProps & {
  vrHudScene: Scene;
};
const VRHud = ({ position = [0, 0, -5] }: VRHUDProps) => {
  // Get actors from root state machine.
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Get refs to root container and object.
  const groupRef = useRef<Group>(null!);

  // const boxHelper = useHelper(objRef, BoxHelper);

  useEffect(() => {
    // Attach to the camera.
    const group = groupRef.current;
    cameraActor.send({ type: 'ASSIGN_VR_HUD', vrHud: group });
  }, [cameraActor]);

  useEffect(() => {
    // Set initial visibility to false.
    const group = groupRef.current;
    group.visible = false;
  }, []);

  return (
    <>
      <DefaultStyleProvider
        color={colors.foreground}
        borderColor={colors.border}
        fontSize={text.base}
      >
        <group name="VR-HUD" ref={groupRef} position={position}>
          <VRDetailsPanel position={[1, 0, 0]} />
          <VRTimePanel position={[0, -1.5, 0]} />
          <VROutliner position={[-1, 0, 0]} />
          <VRSettingsButton position={[1, 2, 0]} />
          <VRSettingsMenu position={[0, 0.5, 0.25]} />
          <VRDebugDisplay />
        </group>
      </DefaultStyleProvider>
    </>
  );
};
