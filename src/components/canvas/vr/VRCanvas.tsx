import { Canvas, useThree } from '@react-three/fiber';

import { MachineContext } from '@/state/xstate/MachineProviders';

import { type PropsWithChildren } from 'react';
import { Controllers, VRButton, XR } from '@react-three/xr';

export const VRCanvas = ({ children }: PropsWithChildren) => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  return (
    <>
      <div className="relative z-10 h-full w-full touch-none select-none overscroll-none">
        <Canvas
          gl={{ logarithmicDepthBuffer: true, localClippingEnabled: true }}
          ref={(canvas) => {
            if (!canvas) return;
            cameraActor.send({ type: 'ASSIGN_CANVAS', canvas });
          }}
        >
          <XR
            onSessionStart={(event) => {
              const session = event.target;

              // Assign session object to external state machine and start session state.
              vrActor.send({ type: 'START_SESSION', session });
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
            onSessionEnd={(event) => {
              console.log('Ending XR session:', event);
              vrActor.send({ type: 'END_SESSION' });
              cameraActor.send({ type: 'END_XR_SESSION' });
            }}
          >
            <Controllers />
            {/* <VRScene /> */}
            {children}
            {/* <VRManager /> */}
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
