import { Canvas, useThree } from '@react-three/fiber';
import Simulation from '~/simulation/components/Simulation';

import { Perf } from 'r3f-perf';
import { VRButton, ARButton, XR } from '@react-three/xr';
import { Suspense } from 'react';
import { LoadingFallback } from './LoadingFallback';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { simState } from '~/simulation/state/SimState';
import { useEventListener } from 'usehooks-ts';
import { HUD } from '~/simulation/components/HUD/HUD';
import { camState } from '~/simulation/state/CamState';

const Scene = () => {
  return (
    <div className="h-min-[42rem] flex h-[42rem] w-full flex-col justify-center">
      <div className=" absolute bottom-0 right-1 h-24 w-40 select-none whitespace-nowrap border-2 border-green-400">
        <VRButton />
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas gl={{ logarithmicDepthBuffer: true }}>
          {/* <XR> */}
          {/* <PerspectiveCamera position={[0, 0, 20]}></PerspectiveCamera> */}
          <CameraControls
            makeDefault
            minDistance={5}
            ref={(controls) => {
              if (!controls) {
                return;
              }

              camState.setControls(controls);
            }}
          >
            <HUD />
          </CameraControls>
          <Simulation />
          {/* <Stats /> */}
          {/* <Perf /> */}
          {/* </XR> */}
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Scene;
