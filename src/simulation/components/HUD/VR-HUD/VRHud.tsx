import { VRDetailsPanel } from './vr-details-panel/VRDetailsPanel';
import { VRTimePanel } from './vr-time-panel/VRTimePanel';
import { colors, text } from './vr-hud-constants';
import { VROutliner } from './vr-outliner/VROutliner';
import { Group, type Vector3Tuple } from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSettingsMenu } from './vr-settings-menu/VRSettingsMenu';
import { Hud, useCamera, useHelper } from '@react-three/drei';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { VRSettingsButton } from './vr-settings-menu/VRSettingsButton';
import { METER } from '@/simulation/utils/constants';

type VRHudProps = {
  position?: Vector3Tuple;
  defaultOpen?: boolean;
};

export const VRHud = ({ position = [0, 0, 0], defaultOpen }: VRHudProps) => {
  // Get actors from root state machine.
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Get refs to root container and object.
  const groupRef = useRef<Group>(null!);

  useEffect(() => {
    // Send to actors to attach to the camera controller.
    const group = groupRef.current;
    cameraActor.send({ type: 'ASSIGN_VR_HUD', vrHud: group });
    vrActor.send({ type: 'ASSIGN_VR_HUD', vrHud: group });
    if (defaultOpen) {
      cameraActor.send({ type: 'SHOW_VR_HUD' });
    }
    return () => console.log('VRhud unmounting.');
  }, [cameraActor, defaultOpen, vrActor]);

  const inVR = useSelector(vrActor, (state) => state.matches('active'));

  return (
    <>
      <group name="VR-Hud" ref={groupRef} position={position}>
        {inVR && (
          <>
            {/* <VRDetailsPanel position={[1, 0, 0]} /> */}
            <VRTimePanel position={[0, -1.5, 0]} scale={0.2} />
            {/* <VROutliner position={[-1, 0, 0]} /> */}
            {/* <VRSettingsButton position={[1, 1.25, 0]} /> */}
            {/* <VRSettingsMenu position={[0, 0.5, 0.25]} />  */}
          </>
        )}
      </group>
    </>
  );
};
