import { Canvas } from '@react-three/fiber';
import { type PropsWithChildren, Suspense, useRef } from 'react';
import { HUD } from '@/components/dom/hud/HUD';
import { MachineContext } from '@/state/xstate/MachineProviders';
import Scene from './Scene';
import { VRManager } from '../vr/VRManager';
import { Loader, Preload } from '@react-three/drei';
import { XR } from '@react-three/xr';
import { VRHud } from '@/components/canvas/vr/vr-hud/VRHud';

export const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

export const sessionOptions: XRSessionInit = {
  requiredFeatures: [REF_SPACE_TYPE],
};
const FRAMERATE = 72;

const CanvasWrapper = ({ children }: PropsWithChildren) => {
  const { cameraActor, uiActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const container = useRef<HTMLDivElement>(null!);

  return (
    <div className="relative z-0 flex h-full w-full flex-col justify-center border">
      <Suspense fallback={null}>
        <HUD className="z-10" />
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
                frameRate={FRAMERATE}
                onSessionStart={(event) => {
                  const session = event.target;
                  console.log('onSessionStart');
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
                <Suspense>
                  <Scene>{children}</Scene>
                  {/* <Stats /> */}
                  {/* <Perf position={'bottom-left'} /> */}
                  <VRManager />
                  <VRHud />
                  {/* <VRDebugPortal position={[0, 0, -1]} scale={0.05} /> */}
                  <Preload all />
                </Suspense>
              </XR>
            </Canvas>
          </div>
        </div>
      </Suspense>
      <Loader />
    </div>
  );
};

export default CanvasWrapper;
