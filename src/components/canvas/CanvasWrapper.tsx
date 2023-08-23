import { Canvas } from '@react-three/fiber';

import { Perf } from 'r3f-perf';
import { VRButton, XR, Controllers } from '@react-three/xr';
import { type PropsWithChildren, Suspense, useContext, useRef } from 'react';
import { LoadingFallback } from '../fallback/LoadingFallback';

import { HUD } from '@/simulation/components/HUD/HUD';
import { MachineContext } from '@/state/xstate/MachineProviders';
import Scene from './Scene';
import { VRManager } from './vr/VRManager';
import { Hud, Loader, Preload, Stats } from '@react-three/drei';
import { VRHUD, VRHud } from '@/simulation/components/HUD/VR-HUD/VRHUD';
import { VRDebugPortal } from '@/simulation/components/HUD/VR-HUD/vr-debug/VRDebugDisplay';

const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

const CanvasWrapper = ({ children }: PropsWithChildren) => {
  const { cameraActor, uiActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const container = useRef<HTMLDivElement>(null!);
  return (
    <Suspense fallback={null}>
      <div className="relative z-0 flex h-full w-full flex-col justify-center border">
        <HUD className="z-10" />
        <Suspense fallback={null}>
          {/** Wrap the canvas in a div to create a separate stacking context. This is necessary because the <Html> components from Drei and portalled out of the canvas and become sibling elements of the canvas. They have an absurdly large z-index, so they will be rendered over top of any of their siblings. Wrapping the canvas in this way ensures that they share a stacking context only with each other and the canvas, and prevents them from clipping through the HUD or the rest of the UI. */}
          <div ref={container} className="relative z-0 h-full w-full">
            <div className="relative z-0 h-full w-full">
              <Canvas
                className="z-[0]"
                // eventSource={container}
                gl={{
                  logarithmicDepthBuffer: true,
                  alpha: true,
                  localClippingEnabled: true,
                  preserveDrawingBuffer: true,
                }}
                linear /* Textures will appear washed out unless this is set. */
                flat
                onCreated={(state) => {
                  // Filter intersections so that invisible objects don't trigger pointer events.
                  state.setEvents({
                    filter: (intersections) =>
                      intersections.filter((i) => i.object.visible),
                  });
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

                    // Create a new reference space.
                    session
                      .requestReferenceSpace(REF_SPACE_TYPE)
                      .then((refSpace) => {
                        // Assign the new reference space to the external state machines.
                        cameraActor.send({
                          type: 'ASSIGN_REF_SPACE',
                          refSpace,
                        });
                        vrActor.send({
                          type: 'ASSIGN_REF_SPACE_ORIGIN',
                          refSpace,
                        });
                      })
                      .catch((reason) => console.error(reason));
                  }}
                  onSessionEnd={(event) => {
                    // Send end session event to state machines.
                    console.log('Ending XR session:', event);
                    vrActor.send({ type: 'END_SESSION' });
                    cameraActor.send({ type: 'END_XR_SESSION' });
                  }}
                  onVisibilityChange={(event) => {
                    console.log('XR visibility change:', event);
                  }}
                  onInputSourcesChange={(event) => {
                    console.log('XR input sources change:', event);
                  }}
                >
                  <Suspense fallback={null}>
                    <Controllers />
                    <VRManager />
                    <Scene>{children}</Scene>
                    <Stats />
                    <Perf position={'bottom-left'} />

                    <VRHud />
                    <VRDebugPortal position={[0, 0, -1]} scale={0.05} />
                    <Preload all />
                  </Suspense>
                </XR>
              </Canvas>
            </div>
          </div>
        </Suspense>
      </div>
      <Loader />
    </Suspense>
  );
};

export default CanvasWrapper;
