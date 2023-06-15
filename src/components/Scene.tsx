import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '~/drei-imports/controls/OrbitControls';
import Simulation from '~/simulation/components/Simulation';
import { PerspectiveCamera } from '~/drei-imports/cameras/PerspectiveCamera';
import { Stats } from '~/drei-imports/misc/Stats';
import { Perf } from '~/drei-imports/performance/Perf';
import { VRButton, ARButton, XR } from '@react-three/xr';
import { Suspense } from 'react';

const Scene = () => {
  // const timerRef = useRef<HTMLSpanElement>(null!);
  // const hourRef = useRef<HTMLParagraphElement>(null!);
  // const dateRef = useRef<HTMLParagraphElement>(null!);
  // const timescaleDisplayRef = useRef<HTMLSpanElement>(null!);

  // const timeElapsedRef = useRef<number>(0);
  // const timescaleRef = useRef<number>(1);

  return (
    <div className="h-min-[42rem] flex h-[42rem] w-full flex-col justify-start">
      <div className="h-min-fit relative h-[42rem] w-full border-2 border-green-500">
        <div className=" absolute bottom-0 right-1 h-24 w-40 select-none whitespace-nowrap border-2 border-green-400">
          <VRButton />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Canvas>
            <XR>
              <PerspectiveCamera position={[0, 0, 5]}>
                <spotLight />
              </PerspectiveCamera>
              <ambientLight intensity={0.1} />
              <OrbitControls makeDefault />
              <Simulation />
              <Stats />
              <Perf />
            </XR>
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default Scene;
