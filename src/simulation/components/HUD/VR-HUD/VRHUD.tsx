import {
  ContainerNode,
  DefaultStyleProvider,
  RootContainer,
} from '@coconut-xr/koestlich';
import { VRDetailsPanel } from './vr-details-panel/VRDetailsPanel';
import { VRTimePanel } from './vr-time-panel/VRTimePanel';
import { colors } from './vr-hud-constants';
import { VROutliner } from './vr-outliner/VROutliner';
import { Object3D, Vector3, type Vector3Tuple } from 'three';
import { useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

const _camWorldPos = new Vector3();

type VRHUDProps = {
  position?: Vector3Tuple;
};
export const VRHUD = ({ position = [0, 0, 0] }: VRHUDProps) => {
  // Get actors from root state machine.
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Get refs to root container and object.
  const objRef = useRef<Object3D>(null!);

  useEffect(() => {
    // Attach to the camera.
    const obj = objRef.current;
    cameraActor.send({ type: 'ASSIGN_VR_HUD', vrHud: obj });
  }, [cameraActor]);

  useEffect(() => {
    const obj = objRef.current;
    // obj.visible = false;
    obj.visible = true;
  }, []);

  return (
    <>
      <DefaultStyleProvider
        color={colors.foreground}
        borderColor={colors.border}
      >
        <object3D ref={objRef} position={position} name="VR-HUD">
          <VRDetailsPanel position={[3, 0, 0]} />
          <VRTimePanel position={[0, -1.5, 0]} />
          <VROutliner position={[-3, 0, 0]} />
        </object3D>
      </DefaultStyleProvider>
    </>
  );
};
