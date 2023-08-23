import { Canvas } from '@react-three/fiber';

import { Perf } from 'r3f-perf';

import {
  type PropsWithChildren,
  Suspense,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { LoadingFallback } from '../fallback/LoadingFallback';

import { HUD } from '@/simulation/components/HUD/HUD';
import { MachineContext } from '@/state/xstate/MachineProviders';
import Scene from './Scene';
import { VRManager } from './vr/VRManager';
import { Hud, Loader, Preload, Stats } from '@react-three/drei';
import { VRHUD, VRHud } from '@/simulation/components/HUD/VR-HUD/VRHUD';
import { VRDebugPortal } from '@/simulation/components/HUD/VR-HUD/vr-debug/VRDebugDisplay';
import { XRCanvas } from '@coconut-xr/natuerlich/defaults';
import { useEnterXR, XR } from '@coconut-xr/natuerlich/react';

const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

const sessionOptions: XRSessionInit = {
  requiredFeatures: [REF_SPACE_TYPE],
};

const CanvasWrapper = ({ children }: PropsWithChildren) => {
  const { cameraActor, uiActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const container = useRef<HTMLDivElement>(null!);
  const enterVR = useEnterXR('immersive-vr', sessionOptions);

  const vrButtonClickHandler = useCallback(() => {
    void enterVR();
    // Send start session event.
  }, []);
  return (
    <Suspense fallback={null}>
      <div className="relative z-0 flex h-full w-full flex-col justify-center border">
        <HUD className="z-10" vrButtonClickHandler={vrButtonClickHandler} />
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
                <XR />
                <Suspense fallback={null}>
                  <Scene>{children}</Scene>
                  <Stats />
                  <Perf position={'bottom-left'} />

                  <VRManager />
                  <VRHud />
                  <VRDebugPortal position={[0, 0, -1]} scale={0.05} />
                  <Preload all />
                </Suspense>
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
