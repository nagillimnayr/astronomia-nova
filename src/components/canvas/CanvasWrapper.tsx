import { Canvas } from '@react-three/fiber';

import { Perf } from 'r3f-perf';
import { VRButton, XR, Controllers } from '@react-three/xr';
import { type PropsWithChildren, Suspense, useContext, useRef } from 'react';
import { LoadingFallback } from '../fallback/LoadingFallback';

import { HUD } from '@/simulation/components/HUD/HUD';
import { MachineContext } from '@/state/xstate/MachineProviders';
import Scene from './Scene';
import { VRManager } from './vr/VRManager';
import { Hud, Stats } from '@react-three/drei';
import { VRHUD } from '@/simulation/components/HUD/VR-HUD/VRHUD';

const CanvasWrapper = ({ children }: PropsWithChildren) => {
  const { cameraActor, uiActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const container = useRef<HTMLDivElement>(null!);
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="relative z-0 flex h-full w-full flex-col justify-center border">
        <HUD className="z-10" />

        {/* <div className="absolute bottom-0 right-1 z-10 h-24 w-40 select-none whitespace-nowrap">
          <VRButton />
        </div> */}

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
              ref={(canvas) => {
                if (!canvas) return;
                // Assign canvas context in camera state machine. This is necessary so that event listeners can be attached for the camera controller.
                cameraActor.send({ type: 'ASSIGN_CANVAS', canvas });
              }}
              onCreated={(state) => {
                // Filter intersections so that invisible objects don't trigger pointer events.
                state.setEvents({
                  filter: (intersections) =>
                    intersections.filter((i) => i.object.visible),
                });
              }}
            >
              <XR
                referenceSpace="viewer"
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
                    .requestReferenceSpace('viewer')
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
                {/* <Hud renderPriority={1}> */}
                <Controllers />
                <VRManager />
                <Scene>{children}</Scene>
                {/* <Stats /> */}
                {/* <Perf position={'bottom-left'} /> */}
                {/* </Hud> */}

                {/** The VR UI, built with @coconut-xr/koestlich, when attached directly to the camera has serious clipping issues whenever the camera moves. Putting the UI inside of a Hud component from React-Three-Drei, however, attaches the UI to a separate scene graph, and it maintains its position relative to the camera, without actually moving, and this resolves the clipping issues. Unfortunately, the XR session doesn't work with the Hud component. */}
                {/* <Hud renderPriority={2}> */}
                {/* <VRManager /> */}
                <VRHUD />
                {/* </Hud> */}
              </XR>
            </Canvas>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CanvasWrapper;
