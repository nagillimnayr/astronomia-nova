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
  const containerRef = useRef<ContainerNode>(null!);
  const objRef = useRef<Object3D>(null!);

  useEffect(() => {
    // Attach to the camera.
    const controls = cameraActor.getSnapshot()!.context.controls;

    if (!controls) return;
    const obj = objRef.current;
    obj.position.setZ(-0.5);
    controls.attachToController(obj);
    controls.getCameraWorldUp(obj.up);
    controls.getCameraWorldPosition(_camWorldPos);
    obj.lookAt(_camWorldPos);
  }, [cameraActor]);

  useEffect(() => {
    const obj = objRef.current;
    obj.visible = false;
    const subscription = vrActor.subscribe((state) => {
      if (state.event.type === 'START_SESSION') {
        obj.visible = true;
      } else if (state.event.type === 'END_SESSION') {
        obj.visible = false;
      }
    });

    return () => subscription.unsubscribe();
  }, [vrActor]);

  return (
    <>
      <DefaultStyleProvider
        color={colors.foreground}
        borderColor={colors.border}
      >
        <object3D ref={objRef} name="VR-HUD">
          <RootContainer position={position} ref={containerRef}>
            <VRDetailsPanel position={[3, 0, 0]} />
            <VRTimePanel position={[0, -2.5, 0]} />
            <VROutliner position={[-3, 0, 0]} />
          </RootContainer>
        </object3D>
      </DefaultStyleProvider>
    </>
  );
};
