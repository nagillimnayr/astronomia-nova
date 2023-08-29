import { Canvas, useThree } from '@react-three/fiber';

import { MachineContext } from '@/state/xstate/MachineProviders';

import { Suspense, type PropsWithChildren } from 'react';
import { VRManager } from './VRManager';
import { VRButton, XR } from '@react-three/xr';

const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

// const sessionOptions: XRSessionInit = {
//   requiredFeatures: [REF_SPACE_TYPE],
// };
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
              console.log('onSessionStart');
              const session = event.target;
              // Send start session event.
              vrActor.send({ type: 'START_SESSION' });
              cameraActor.send({
                type: 'START_XR_SESSION',
              });
            }}
            onSessionEnd={(event) => {
              console.log('onSessionEnd');
              const session = event.target;
              // Send end session event.
              vrActor.send({ type: 'END_SESSION' });
              cameraActor.send({
                type: 'END_XR_SESSION',
              });
            }}
          >
            <Suspense fallback={null}>
              {children}
              <VRManager />
            </Suspense>
          </XR>
        </Canvas>
        <div className="absolute bottom-10 right-20 z-20 h-fit w-fit whitespace-nowrap ">
          <VRButton className="whitespace-nowrap hover:bg-subtle" />
        </div>
      </div>
    </>
  );
};
