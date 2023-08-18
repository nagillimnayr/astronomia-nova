import {
  RootContainer,
  Container,
  Text,
  ContainerNode,
} from '@coconut-xr/koestlich';
import { Suspense, useEffect, useRef } from 'react';
import { GOLDEN_RATIO, colors, text } from '../vr-hud-constants';
import { VRDateDisplay } from './VRDateDisplay';
import { VRTimeControls } from './vr-time-controls/VRTimeControls';
import { VRTimescaleDisplay } from './VRTimescaleDisplay';
import { VRTimescaleSlider } from './vr-time-controls/VRTimescaleSlider';
import { Object3D, Vector3Tuple, Vector3 } from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';

const _camWorldPos = new Vector3();

type VRTimePanelProps = {
  position?: Vector3Tuple;
};
export const VRTimePanel = ({ position = [0, 0, 0] }: VRTimePanelProps) => {
  // Get actors from root state machine.
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  // Get refs to root container and object.
  const containerRef = useRef<ContainerNode>(null!);
  const objRef = useRef<Object3D>(null!);

  // useEffect(() => {
  //   const controls = cameraActor.getSnapshot()!.context.controls;

  //   if (!controls) return;
  //   const obj = objRef.current;
  //   // obj.position.setZ(-5);
  //   // controls.attachToController(obj);
  //   controls.getCameraWorldUp(obj.up);
  //   controls.getCameraWorldPosition(_camWorldPos);
  //   obj.lookAt(_camWorldPos);
  // }, [cameraActor]);

  const height = 1;
  const width = height * GOLDEN_RATIO;
  return (
    <>
      {/** Its better to put the object3D outside of the Suspense barrier, so as to not delay setting the reference. */}
      <object3D position={position} ref={objRef} name="VR-Time-Panel">
        <Suspense>
          <RootContainer
            ref={containerRef}
            // position={position}
            sizeX={width}
            sizeY={height}
            backgroundColor={colors.muted}
            borderRadius={text.base}
            borderColor={colors.border}
            border={4}
            display="flex"
            flexDirection="column"
            alignItems="stretch"
            justifyContent="space-evenly"
            padding={text.base}
            gapRow={10}
          >
            <VRTimescaleDisplay index={0} />
            <VRDateDisplay index={1} />
            <VRTimeControls index={2} />
            <VRTimescaleSlider index={3} />
          </RootContainer>
        </Suspense>
      </object3D>
    </>
  );
};
