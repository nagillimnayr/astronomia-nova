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
import { VRSurfaceDialog } from './vr-details-panel/VRSurfaceDialog';

type VRHudProps = {
  position?: Vector3Tuple;
  defaultOpen?: boolean;
};

export const VRHud = ({
  position = [0, 0, 0],
  defaultOpen = false,
}: VRHudProps) => {
  // Get actors from root state machine.
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Get refs to root container and object.
  const groupRef = useRef<Group>(null!);

  useEffect(() => {
    if (!cameraActor || !vrActor) return;
    // Send to actors to attach to the camera controller.
    const group = groupRef.current;
    cameraActor.send({ type: 'ASSIGN_VR_HUD', vrHud: group });
    vrActor.send({ type: 'ASSIGN_VR_HUD', vrHud: group });
    // if (defaultOpen) {
    //   cameraActor.send({ type: 'SHOW_VR_HUD' });
    // }
    return () => console.log('VRhud unmounting.');
  }, [cameraActor, vrActor]);

  // Subscribe so that component will re-render upon entering VR.
  const inVR = useSelector(vrActor, (state) => state.matches('active'));

  const isOpen = inVR || defaultOpen;
  return (
    <>
      <group name="VR-Hud" ref={groupRef} position={position}>
        {isOpen && (
          <>
            <VRDetailsPanel position={[1.5, 0, 0]} scale={0.6} />
            <VRTimePanel position={[0, -1, 0]} scale={0.1} />
            {/* <VROutliner position={[-1, 0, 0]} /> */}
            <VRSettingsButton position={[-2, 1.25, 0]} size={0.01} />
            <VRSettingsMenu position={[-1.5, 0, 0.25]} />
          </>
        )}
      </group>
      <>
        <VRSurfaceDialog />
      </>
    </>
  );
};
