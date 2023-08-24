import { Canvas, useThree } from '@react-three/fiber';

import { MachineContext } from '@/state/xstate/MachineProviders';

import { type PropsWithChildren } from 'react';
import { VRManager } from './VRManager';
import { XRCanvas } from '@coconut-xr/natuerlich/defaults';
import { useEnterXR } from '@coconut-xr/natuerlich/react';
import { EnterVRButton } from './EnterVRButton';
import { VRButton, XR } from '@react-three/xr';

const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

const sessionOptions: XRSessionInit = {
  requiredFeatures: [REF_SPACE_TYPE],
};

const FRAMERATE = 72;

export const VRCanvas = ({ children }: PropsWithChildren) => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  return (
    <>
      <div className="relative z-10 h-full w-full touch-none select-none overscroll-none">
        <Canvas
          flat
          linear /* Textures will appear washed out unless this is set. */
          gl={{ logarithmicDepthBuffer: true, localClippingEnabled: true }}
        >
          <XR
            referenceSpace={REF_SPACE_TYPE}
            frameRate={FRAMERATE}
            onSessionStart={(event) => {
              const session = event.target;
              // Send start session event.
              vrActor.send({ type: 'START_SESSION' });
              cameraActor.send({
                type: 'START_XR_SESSION',
              });

              console.log(session);
            }}
            onSessionEnd={(event) => {
              const session = event.target;
              // Send end session event.
              vrActor.send({ type: 'END_SESSION' });
              cameraActor.send({
                type: 'END_XR_SESSION',
              });

              console.log(session);
            }}
          >
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
