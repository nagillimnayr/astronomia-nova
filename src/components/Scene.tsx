import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '~/drei-imports/controls/OrbitControls';
import Simulation from '~/simulation/components/Simulation';
import { PerspectiveCamera } from '~/drei-imports/cameras/PerspectiveCamera';
import { Stats } from '~/drei-imports/misc/Stats';
import { useRef } from 'react';
import TimerContext from '~/simulation/context/TimerContext';
import TimeDisplay from '~/simulation/components/Time/TimeDisplay';

const Scene = () => {
  const timerRef = useRef<HTMLSpanElement>(null!);
  const timerPortalRef = useRef<HTMLDivElement>(null!);

  return (
    <div className="flex h-full w-full flex-col justify-start">
      <TimerContext.Provider value={{ timerRef, portalRef: timerPortalRef }}>
        <div className="h-full w-full border-2 border-green-500">
          <Canvas>
            <PerspectiveCamera position={[0, 0, 5]}>
              <spotLight />
            </PerspectiveCamera>
            <ambientLight intensity={0.1} />
            <OrbitControls />
            <Simulation />
            <Stats />
          </Canvas>
        </div>

        {/* Timer */}
        <TimeDisplay />
      </TimerContext.Provider>
    </div>
  );
};

export default Scene;
