import { Canvas, useThree } from '@react-three/fiber';
import Simulation from '~/simulation/components/Simulation';

import { Perf } from 'r3f-perf';
import { VRButton, ARButton, XR } from '@react-three/xr';
import { Suspense } from 'react';
import { LoadingFallback } from '../LoadingFallback';
import {
  OrbitControls,
  CameraControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { HUD } from '~/simulation/components/HUD/HUD';
import { camState } from '~/simulation/state/CamState';

const Scene = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="h-min-full relative flex h-full w-full flex-col justify-center">
        <HUD />
        <div className=" absolute bottom-0 right-1 z-[9999] h-24 w-40 select-none whitespace-nowrap">
          <VRButton />
        </div>
        {/* <Suspense fallback={<LoadingFallback />}> */}
        <Canvas gl={{ logarithmicDepthBuffer: true }}>
          <XR>
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 20]}
              near={0.01}
              far={1000000}
              // ref={(camera) => {
              //   if (!camera) return;
              //   camState.setCamera(camera);
              // }}
            />
            <CameraControls
              makeDefault
              minDistance={5}
              ref={(controls) => {
                if (!controls) {
                  return;
                }

                camState.setControls(controls);
              }}
            />
            {/* <OrbitControls
              makeDefault
              enableDamping
              minDistance={1.5}
              enablePan={false}
              ref={(controls) => {
                if (!controls) {
                  return;
                }

                camState.setControls(controls);
              }}
            /> */}
            <Simulation />
            {/* <Stats /> */}
            <Perf />
          </XR>
        </Canvas>
        {/* </Suspense> */}
      </div>
    </Suspense>
  );
};

export default Scene;
