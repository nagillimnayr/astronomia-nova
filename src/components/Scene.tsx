import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '~/drei-imports/controls/OrbitControls';
import Simulation from '~/simulation/components/Simulation';
import { PerspectiveCamera } from '~/drei-imports/cameras/PerspectiveCamera';
import { Stats } from '~/drei-imports/misc/Stats';
import { Perf } from '~/drei-imports/performance/Perf';
import { VRButton, ARButton, XR } from '@react-three/xr';
import { Suspense } from 'react';
import { LoadingFallback } from './LoadingFallback';

const Scene = () => {
  return (
    <div className="h-min-[42rem] flex h-[42rem] w-full flex-col justify-center">
      <div className=" absolute bottom-0 right-1 h-24 w-40 select-none whitespace-nowrap border-2 border-green-400">
        <VRButton />
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas gl={{ logarithmicDepthBuffer: true }}>
          <XR>
            <Simulation />
            {/* <Stats /> */}
            <Perf />
          </XR>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Scene;
