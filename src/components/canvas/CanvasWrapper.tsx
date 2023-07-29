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
  View,
} from '@react-three/drei';
import { HUD } from '@/simulation/components/HUD/HUD';
// import { useCameraStore } from '@/simulation/state/zustand/camera-store';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { degToRad } from 'three/src/math/MathUtils';
import {
  DIST_MULT,
  EARTH_RADIUS,
  SUN_RADIUS,
} from '@/simulation/utils/constants';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { CamView } from '@/simulation/components/HUD/CamView/CamView';
import { PerspectiveCamera } from 'three';
import Scene from './Scene';

const CanvasWrapper = ({ children }: PropsWithChildren) => {
  const { cameraService, uiService } = useContext(GlobalStateContext);
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
              eventSource={container}
              gl={{ logarithmicDepthBuffer: true }}
              linear
              flat
              ref={(canvas) => {
                if (!canvas) return;
                // Assign canvas context in camera state machine.
                cameraService.send({ type: 'ASSIGN_CANVAS', canvas });
              }}
            >
              <Hud renderPriority={1}>
                <XR>
                  <PerspectiveCam
                    makeDefault
                    ref={(cam) => {
                      const camera = cam as PerspectiveCamera;
                      // Assign camera to state context.
                      cameraService.send({
                        type: 'ASSIGN_SPACE_CAMERA',
                        camera,
                      });
                    }}
                    position={[0, 0, SUN_RADIUS / 10 / DIST_MULT + 1000]}
                    near={1e-5}
                    far={1e14}
                  />
                  <CameraControls
                    makeDefault
                    minDistance={1e-3}
                    polarAngle={degToRad(60)}
                    ref={(controls) => {
                      if (!controls) {
                        return;
                      }
                      // if (controls === cameraState.controls) return;
                      if (
                        controls === cameraService.machine.context.spaceControls
                      ) {
                        return;
                      }
                      // Assign controls context in camera state machine.
                      cameraService.send({
                        type: 'ASSIGN_SPACE_CONTROLS',
                        controls,
                      });
                    }}
                  />

                  <Scene>{children}</Scene>
                  {/* <Stats /> */}
                  {/* <Perf /> */}
                </XR>
              </Hud>
              <Hud renderPriority={2}>
                <CamView />
              </Hud>
            </Canvas>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CanvasWrapper;
