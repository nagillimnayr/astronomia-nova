import { VRDetailsPanel } from '@/components/canvas/vr/vr-hud/vr-details-panel/VRDetailsPanel';
import { Group, type Vector3Tuple } from 'three';
import { useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSettingsMenu } from '@/components/canvas/vr/vr-hud/vr-settings-menu/VRSettingsMenu';
import { VRSettingsButton } from '@/components/canvas/vr/vr-hud/vr-settings-menu/VRSettingsButton';
import { VRHudSphereAttachment } from '@/components/canvas/vr/vr-hud/vr-hud-sphere/VRHudSphereAttachment';
import { degToRad } from 'three/src/math/MathUtils';
import { VRTimeDisplay } from '@/components/canvas/vr/vr-hud/vr-time-panel/vr-time-display/VRTimeDisplay';
import { VRTimeControls } from '@/components/canvas/vr/vr-hud/vr-time-panel/vr-time-controls/VRTimeControls';

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

  const radius = 3;
  return (
    <>
      <group name="VR-Hud" ref={groupRef} position={position}>
        {isOpen && (
          <>
            <group position-z={0}>
              {/** Details Panel. */}
              <VRHudSphereAttachment
                radius={radius}
                phi={degToRad(0)}
                theta={degToRad(30)}
              >
                <VRDetailsPanel scale={0.6} />
              </VRHudSphereAttachment>

              {/** Time Panels. */}
              <VRHudSphereAttachment
                radius={radius}
                phi={degToRad(-25)}
                theta={degToRad(0)}
              >
                <VRTimeDisplay scale={0.1} />
              </VRHudSphereAttachment>
              <VRHudSphereAttachment
                radius={radius}
                phi={degToRad(-30)}
                theta={degToRad(0)}
              >
                <VRTimeControls scale={0.1} />
              </VRHudSphereAttachment>

              {/** Settings Menu Button. */}
              <VRHudSphereAttachment
                radius={radius}
                phi={degToRad(25)}
                theta={degToRad(-30)}
              >
                <VRSettingsButton size={0.01} />
              </VRHudSphereAttachment>

              {/** Settings Menu. */}
              <VRHudSphereAttachment
                radius={radius}
                phi={degToRad(5)}
                theta={degToRad(-30)}
              >
                <VRSettingsMenu />
              </VRHudSphereAttachment>

              {/* <VRTagProjector /> */}
              {/* <VROutliner position={[-1, 0, 0]} /> */}
              {/* <VRHudSphere radius={radius} /> */}
            </group>
          </>
        )}
      </group>
    </>
  );
};
