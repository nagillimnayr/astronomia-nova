import { Canvas, useThree } from '@react-three/fiber';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { VRScene } from './VRScene';
import { CameraControls } from '@react-three/drei';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { CameraManager } from '@/simulation/components/camera-controller/CameraManager';
import { type PropsWithChildren } from 'react';
import { VRManager } from './VRManager';

import { XRCanvas } from '@coconut-xr/natuerlich/defaults';
import {
  useEnterXR,
  NonImmersiveCamera,
  ImmersiveSessionOrigin,
} from '@coconut-xr/natuerlich/react';

const sessionOptions: XRSessionInit = {
  requiredFeatures: ['local'],
};

export const VRCanvas = ({ children }: PropsWithChildren) => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const enterVR = useEnterXR('immersive-vr', sessionOptions);

  return (
    <>
      <div className="relative z-10 h-full w-full ">
        <Canvas>
          <XR
            onSessionStart={(event) => {
              const session = event.target;

              // Assign session object to external state machine and start session state.
              // vrActor.send({ type: 'START_SESSION', session });
              cameraActor.send({
                type: 'START_XR_SESSION',
                xrSession: session,
              });

              session
                .requestReferenceSpace('local')
                .then((refSpace) => {
                  refSpace = refSpace.getOffsetReferenceSpace(
                    new XRRigidTransform({ x: 0, y: -1, z: -2 })
                  );
                  cameraActor.send({ type: 'ASSIGN_REF_SPACE', refSpace });
                })
                .catch((reason) => console.error(reason));
            }}
          >
            <Controllers />
            {/* <VRScene /> */}
            {children}
            <VRManager />
          </XR>
        </Canvas>
        <div className="absolute bottom-10 right-20 z-20 h-fit w-fit whitespace-nowrap ">
          <VRButton />
        </div>
      </div>
    </>
  );
};
