import { Canvas, useThree } from '@react-three/fiber';

import { Suspense } from 'react';
import { LoadingFallback } from '../../LoadingFallback';
import { CameraControls, PerspectiveCamera, Sphere } from '@react-three/drei';
import { camState } from '@/simulation/state/CamState';

type SceneProps = {
  children?: React.ReactNode;
};
const Scene = (props: SceneProps) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="h-min-full relative flex h-full w-full flex-col justify-center">
        {/* <Suspense fallback={<LoadingFallback />}> */}
        <Canvas gl={{ logarithmicDepthBuffer: true }}>
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

              camState.setControls(controls);
            }}
          />
          <Sphere></Sphere>
        </Canvas>
      </div>
    </Suspense>
  );
};

export default Scene;
