import { Canvas } from '@react-three/fiber';
import Simulation from '@/simulation/components/Simulation';

import { Perf } from 'r3f-perf';
import { VRButton, XR } from '@react-three/xr';
import { type PropsWithChildren, Suspense, useContext } from 'react';
import { LoadingFallback } from '../LoadingFallback';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { HUD } from '@/simulation/components/HUD/HUD';
// import { useCameraStore } from '@/simulation/state/zustand/camera-store';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { degToRad } from 'three/src/math/MathUtils';

const Scene = ({ children }: PropsWithChildren) => {
  const { cameraState } = useContext(RootStoreContext);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="relative z-0 flex h-full w-full flex-col justify-center border">
        <HUD className="z-10" />

        <div className="absolute bottom-0 right-1 z-10 h-24 w-40 select-none whitespace-nowrap">
          <VRButton />
        </div>

        {/** Wrap the canvas in a div to create a separate stacking context. This is necessary because the <Html> components from Drei and portalled out of the canvas and become sibling elements of the canvas. They have an absurdly large z-index, so they will be renderer over top of any of their siblings. Wrapping the canvas in this way ensures that they share a stacking context only with each other and the canvas, and prevents them from clipping through the HUD or the rest of the UI. */}
        <div className="relative z-0 h-full w-full">
          <Canvas gl={{ logarithmicDepthBuffer: true }} linear flat>
            <XR>
              <PerspectiveCamera
                makeDefault
                position={[0, 0, 20]}
                near={0.01}
                far={1000000}
              />
              <CameraControls
                makeDefault
                minDistance={0.1}
                ref={(controls) => {
                  if (!controls) {
                    return;
                  }
                  if (controls === cameraState.controls) return;
                  cameraState.setControls(controls);
                  controls
                    .rotatePolarTo(degToRad(15), false)
                    .catch((reason) => {
                      console.error(reason);
                    });
                }}
              />

              <Simulation>{children}</Simulation>

              {/* <Stats /> */}
              {/* <Perf /> */}
            </XR>
          </Canvas>
        </div>
      </div>
    </Suspense>
  );
};

export default Scene;
