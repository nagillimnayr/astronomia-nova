import {
  ContainerNode,
  DefaultStyleProvider,
  RootContainer,
} from '@coconut-xr/koestlich';
import { VRDetailsPanel } from './vr-details-panel/VRDetailsPanel';
import { VRTimePanel } from './vr-time-panel/VRTimePanel';
import { colors } from './vr-hud-constants';
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
import { useCamera, useHelper } from '@react-three/drei';
import { createPortal, useFrame, useThree } from '@react-three/fiber';

const _camWorldPos = new Vector3();

type VRHUDProps = {
  position?: Vector3Tuple;
};
export const VRHUD = ({ position = [0, 0, -3] }: VRHUDProps) => {
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
    const group = groupRef.current;
    group.visible = true;
  }, []);

  // Get the current default camera so we can render the VRHUD to it.
  const camera = useThree(({ camera }) => camera);
  return createPortal(
    <>
      <DefaultStyleProvider
        color={colors.foreground}
        borderColor={colors.border}
      >
        <group ref={groupRef} position={position} name="VR-HUD">
          <VRDetailsPanel position={[3, 0, 0]} />
          <VRTimePanel position={[0, -1.5, 0]} />
          <VROutliner position={[-3, 0, 0]} />
          {/* <VRSettingsMenu position={[0, 0.5, 0]} /> */}
        </group>
      </DefaultStyleProvider>
    </>,
    camera
  );
};
