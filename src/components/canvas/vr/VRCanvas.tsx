import { Canvas, useThree } from '@react-three/fiber';

import { MachineContext } from '@/state/xstate/MachineProviders';

import { type PropsWithChildren } from 'react';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { Hud } from '@react-three/drei';
import { VRManager } from './VRManager';

const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

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
          ref={(canvas) => {
            if (!canvas) return;
            cameraActor.send({ type: 'ASSIGN_CANVAS', canvas });
          }}
        >
          <XR
            referenceSpace={REF_SPACE_TYPE}
            onSessionStart={(event) => {
              const session = event.target;

              // Assign session object to external state machine and start session state.
              vrActor.send({ type: 'START_SESSION', session });
              cameraActor.send({
                type: 'START_XR_SESSION',
                xrSession: session,
              });

              session
                .requestReferenceSpace(REF_SPACE_TYPE)
                .then((refSpace) => {
                  // refSpace = refSpace.getOffsetReferenceSpace(
                  //   new XRRigidTransform({ x: 0, y: -1, z: -2 })
                  // );
                  cameraActor.send({ type: 'ASSIGN_REF_SPACE', refSpace });
                })
                .catch((reason) => console.error(reason));
            }}
            onSessionEnd={(event) => {
              console.log('Ending XR session:', event);
              vrActor.send({ type: 'END_SESSION' });
              cameraActor.send({ type: 'END_XR_SESSION' });
            }}
          >
            <Controllers />
            {/* <VRScene /> */}
            {children}
            <VRManager />
          </XR>
        </Canvas>
        <div className="absolute bottom-10 right-20 z-20 h-fit w-fit whitespace-nowrap ">
          {/* <button
            className="rounded-md border border-white p-2 transition-colors hover:bg-subtle"
            onClick={enterVR}
          >
            Enter VR!
          </button> */}
          <VRButton />
        </div>
      </div>
    </>
  );
};
