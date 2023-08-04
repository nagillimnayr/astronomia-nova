import { Canvas } from '@react-three/fiber';
import Simulation from '@/simulation/components/Simulation';

import { Perf } from 'r3f-perf';
import { VRButton, XR } from '@react-three/xr';
import { type PropsWithChildren, Suspense, useContext, useRef } from 'react';
import { LoadingFallback } from '../LoadingFallback';
import {
  CameraControls,
  Hud,
  PerspectiveCamera as PerspectiveCam,
} from '@react-three/drei';
import { HUD } from '@/simulation/components/HUD/HUD';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { CamView } from '@/simulation/components/HUD/CamView/CamView';
import Scene from './Scene';

const CanvasWrapper = ({ children }: PropsWithChildren) => {
  const { cameraActor, uiActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const container = useRef<HTMLDivElement>(null!);
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="relative z-0 flex h-full w-full flex-col justify-center border">
        <HUD className="z-10" />

        <div className="absolute bottom-0 right-1 z-10 h-24 w-40 select-none whitespace-nowrap">
          <VRButton />
        </div>

        {/** Wrap the canvas in a div to create a separate stacking context. This is necessary because the <Html> components from Drei and portalled out of the canvas and become sibling elements of the canvas. They have an absurdly large z-index, so they will be rendered over top of any of their siblings. Wrapping the canvas in this way ensures that they share a stacking context only with each other and the canvas, and prevents them from clipping through the HUD or the rest of the UI. */}
        <div ref={container} className="relative z-0 h-full w-full">
          <div className="relative z-0 h-full w-full">
            <Canvas
              className="z-[0]"
              // eventSource={container}
              gl={{ logarithmicDepthBuffer: true, alpha: true }}
              linear
              flat
              ref={(canvas) => {
                if (!canvas) return;
                // Assign canvas context in camera state machine.
                cameraActor.send({ type: 'ASSIGN_CANVAS', canvas });
              }}
            >
              {/* <Hud renderPriority={1}> */}
              <XR>
                <Scene>{children}</Scene>
                {/* <Stats /> */}
                {/* <Perf /> */}
              </XR>
              {/* </Hud> */}
              {/* <Hud renderPriority={2}>
                <CamView />
              </Hud> */}
            </Canvas>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CanvasWrapper;
