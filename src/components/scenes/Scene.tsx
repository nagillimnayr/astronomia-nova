import { Canvas, useThree } from '@react-three/fiber';
import Simulation from '@/simulation/components/Simulation';

import { Perf } from 'r3f-perf';
import { VRButton, ARButton, XR } from '@react-three/xr';
import { Suspense } from 'react';
import { LoadingFallback } from '../LoadingFallback';
import {
  OrbitControls,
  CameraControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { HUD } from '@/simulation/components/HUD/HUD';
import { useCameraStore } from '@/simulation/state/zustand/camera-store';

type SceneProps = {
  children?: React.ReactNode;
};
const Scene = (props: SceneProps) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="h-min-full relative flex h-full w-full flex-col justify-center border">
        <HUD className="z-10 " />
        <div className="absolute bottom-0 right-1 z-[2] h-24 w-40 select-none whitespace-nowrap">
          <VRButton />
        </div>
        {/* <Suspense fallback={<LoadingFallback />}> */}
        <div className="relative z-0 h-full w-full">
          <Canvas gl={{ logarithmicDepthBuffer: true }}>
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

                  useCameraStore.getState().setCameraControls(controls);
                }}
              />

              <Simulation>{props.children}</Simulation>

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
