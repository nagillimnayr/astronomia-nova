import { CameraManager } from '@/components/canvas/scene/camera-controller/CameraManager';
import { Simulation } from '@/components/canvas/simulation/Simulation';

import { type PropsWithChildren } from 'react';
import { useKeyboard } from './useKeyboard';

const Scene = ({ children }: PropsWithChildren) => {
  useKeyboard();
  return (
    <>
      <CameraManager />
      <Simulation>{children}</Simulation>
    </>
  );
};

export default Scene;
